import React, { useState } from 'react';
import  abcjs from 'abcjs';
import FileUpload  from './fileupload';
import ExerciseData from '../interfaces/exerciseData';
import AudioHandler from './audiohandler';


export function Exercise({ 
    setExerciseData,
    teacherMode,
    exerciseData,
    files,
    setFiles
}: { 
    exerciseData: ExerciseData | undefined;
    setExerciseData: ((newData: ExerciseData) => void);
    teacherMode: boolean;
    files:File[];
    setFiles:((newFile: File[]) => void);
}) {
    var abc,ans,feed, color: string;
    var selNotes: any[] = [];
    var visualObjs: any;
    var correct: any;
    abc = "";
    ans = "";
    feed = "";
    if(exerciseData !== undefined && exerciseData.score !== undefined && exerciseData.correctAnswer !== undefined && exerciseData.feedback !== undefined){
            abc = exerciseData.score;
            ans = exerciseData.correctAnswer;
            feed = exerciseData.feedback;
    }
    const [output, setOutput] = useState<string>();
    const [selectedAnswer, setSelectedAnswer] = useState<string>();
    const [correctAnswer, setCorrectAnswer] = useState<string>(ans);
    const [itemList, setItemList] = useState<JSX.Element[]>();
    
    const [abcFile, setAbcFile] = useState<string>(abc);
    const [ana, setAna] = useState<string>(); 

    //yoinked/edited from abcjs! probably don't need all of it for highlighting but oh well
    const setClass = function (elemset: any, addClass: any, removeClass: any, color: any) {
        if (!elemset)
            return;
        for (var i = 0; i < elemset.length; i++) {
            var el = elemset[i];
            var attr = el.getAttribute("highlight");
            if (!attr) attr = "fill";
            el.setAttribute(attr, color);
            var kls = el.getAttribute("class");
            if (!kls) kls = "";
            kls = kls.replace(removeClass, "");
            kls = kls.replace(addClass, "");
            if (addClass.length > 0) {
                if (kls.length > 0 && kls[kls.length - 1] !== ' ') kls += " ";
                kls += addClass;
            }
            el.setAttribute("class", kls);
        }
    };

    //yoinked/edited from abcjs! changed behavior so it works how we want it to B)
    const highlight = function (note: any, klass: any, clicked: boolean) {
        
        var selTim = note.abselem.elemset[0].getAttribute("selectedTimes");
        if (clicked) selTim++;
        if (selTim >= 4) {
            selTim = 0;
        }
        if (klass === undefined)
            klass = "abcjs-note_selected";
        if (selTim <= 0) {
            color = "#000000";
        }
        if (selTim == 1) {
            color = "#ff0000";
        }
        if (selTim == 2) {
            color = "#00ff00";
        }
        if (selTim == 3) {
            color = "#0000ff";
        }
        if (clicked) note.abselem.elemset[0].setAttribute("selectedTimes", selTim);
        setClass(note.abselem.elemset, klass, "", color);
    };

    //handles notes when they are clicked on: selects them and highlights them
    const clickListener = function (abcelem:any, tuneNumber: number, classes:string, analysis:abcjs.ClickListenerAnalysis, drag:abcjs.ClickListenerDrag){
        var op = JSON.stringify(drag.index);
        setOutput(op);
        setAna(JSON.stringify(drag.index));
        var note = abcelem;
        var noteElems = note.abselem.elemset[0];
        //selected notes handling
        if(!(noteElems.getAttribute("selectedTimes"))) {
            noteElems.setAttribute("selectedTimes", 0)
        }
        if(!selNotes.includes(note)) {
            selNotes[selNotes.length] = note;
        }
        for (var i=0; i<selNotes.length; i++) {
            if(selNotes[i] === note) {
                highlight(selNotes[i], undefined, true);
            } else {
                highlight(selNotes[i], undefined, false);
            }
        }
        var test = document.querySelector(".clicked-info");
        if(test !== null) {test.innerHTML = "<div class='label'>Clicked info:</div>" + op;}
        /* var staffCt = (Number(noteElems.getAttribute("staffPos"))) + 1, measureCt = (Number(noteElems.getAttribute("measurePos")) + 1);
        console.log("Note is on staff " + staffCt + " and measure " + measureCt); */
    }
    
    const loadScore = function() {
        // sample file: "X:1\nZ:Copyright ©\n%%scale 0.83\n%%pagewidth 21.59cm\n%%leftmargin 1.49cm\n%%rightmargin 1.49cm\n%%score [ 1 2 ] 3\nL:1/4\nQ:1/4=60\nM:4/4\nI:linebreak $\nK:Amin\nV:1 treble nm=Flute snm=Fl.\nV:2 treble transpose=-9 nm=Alto Saxophone snm=Alto Sax.\nV:3 bass nm=Violoncello snm= Vc.\nV:1\nc2 G3/2 _B/ | _A/_B/ c _d f | _e _d c2 |] %3\nV:2\n[K:F#min] =c d c3/2 e/ | =f f/e/ d2 | =f e f2 |] %3\nV:3\n_A,,2 _E,,2 | F,,2 _D,,2 | _E,,2 _A,,2 |] %3"
        var abcString = abcFile;
        var el = document.getElementById("target");
        if(el !== null && abcString !== undefined){visualObjs = abcjs.renderAbc(el,abcString,{ clickListener: clickListener, selectTypes: ["note"]});}
        
        // adds staff # and measure # to each note when the score is first loaded
        var staffArray = visualObjs[0].lines[0].staff;
        for (let i = 0, j = 0, staff = 0, measure = 0; i < staffArray[0].voices[0].length + staffArray[1].voices[0].length + staffArray[2].voices[0].length - 3; i++, j++) {
            if(!(staffArray[staff].voices[0][j].abselem.elemset[0].getAttribute("staffPos"))) staffArray[staff].voices[0][j].abselem.elemset[0].setAttribute("staffPos", staff);
            if(!(staffArray[staff].voices[0][j].abselem.elemset[0].getAttribute("measurePos"))) staffArray[staff].voices[0][j].abselem.elemset[0].setAttribute("measurePos", measure);
            if(staffArray[staff].voices[0][j].el_type === "bar") measure++;
            if(j + 1 == staffArray[staff].voices[0].length) {
                staff++;
                j = -1;
                measure = 0;
            }
        }
    }

    const save = function(){
        if(abcFile !== undefined && selectedAnswer !== undefined){
            let data = new ExerciseData(abcFile, selectedAnswer, "");
            setExerciseData(data);
        }
            
    }

    const selectAnswer = function() {
        if(output !== undefined && selectedAnswer !== output) {
            const newSelected = (output);
            setSelectedAnswer(newSelected);
        }else{
            setSelectedAnswer('');
        }
    }

    return (
        <div>
            {teacherMode===true?
            <span>
                <FileUpload setFiles={setFiles} files={files} setAbcFile={setAbcFile}></FileUpload>
                <button onClick={loadScore}>Load Score</button>
                <div id ="target"></div>
                <div className="clicked-info"></div>
                <div>Analysis: {ana}</div>
                <button onClick={selectAnswer}>Select Answer</button>
                <div>Currently selected answer:</div>
                <ul>
                    <li>{selectedAnswer}</li>
                </ul>
                <button onClick={save}>Save</button>
                
            </span>
            :
            <span>
            <button onClick={loadScore}>Load Score</button>
            <div id ="target"></div>
            <div className="clicked-info"></div>
            <AudioHandler files={files}></AudioHandler>
            <div>Analysis: {ana}</div>
            <button onClick={selectAnswer}>Check Answer</button>
            {selectedAnswer !== undefined ? (
                selectedAnswer === correctAnswer ? 
                    <div>Correct!</div>
                    :
                    <div>Incorrect </div>) : 
                <div>Select an Answer</div>
            }
            </span>
            }
            
        </div>

    );
}