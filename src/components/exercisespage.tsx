import { Exercise } from './exercise';
import ExerciseData from '../interfaces/exerciseData';

export function ExercisesPage({
    files,
    setFiles,
    allExData,
    setAllExData
}:{
    files:File[];
    setFiles: ((newFiles: File[]) => void);
    allExData: (ExerciseData | undefined)[];
    setAllExData: ((newData: (ExerciseData | undefined)[]) => void);
}){

    return (
        <div style={{margin: "10px"}}>
            <h2>Welcome to the Exercises Page!</h2>
            {allExData.map(function(exercise) {
                if (exercise !== undefined)
                return (
                    <Exercise key={exercise.exIndex} teacherMode={false} allExData={allExData} setAllExData={setAllExData} files={files} setFiles={setFiles} exIndex={exercise.exIndex}></Exercise>
                )
                else return <></>;
            })}
            {/* <Exercise teacherMode ={false} allExData = {allExData} setAllExData = {setAllExData}files ={files} setFiles={setFiles} exIndex={0}></Exercise>

            <Exercise teacherMode ={false} allExData = {allExData} setAllExData = {setAllExData} files ={files} setFiles={setFiles} exIndex={1}></Exercise> */}
        </div>

    );
}
