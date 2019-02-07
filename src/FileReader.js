import React, { Component } from 'react';
import Papa from 'papaparse';
import Chart from "react-google-charts";
import MinimumGrade from './components/MinimumGrade/MinimumGrade';
import BestGrade from './components/BestGrade/BestGrade';
import Button from './components/Button/Button';
import ButtonDisabled from './components/Button/ButtonDisabled';

class FileReader extends Component {

    state = {
        csvfile: undefined,
        dataFromCSV: [],
        isFileLoaded: false,
        globalGrades: null,
        studentsFirstGrade: [],
        averageFirstGrade: 0,
        studentsSecondGrade: [],
        averageSecondGrade: 0,
        studentsThirdGrade: [],
        averageThirdGrade: 0,
        studentBestGrade: null,
        studentWorstGrade: null,
        isDataLoaded: false
    };

    handleChange = event => {
        this.setState({
            csvfile: event.target.files[0],
            isFileLoaded: true
        });
    };

    importCSV = () => {
        const { csvfile } = this.state;
        Papa.parse(csvfile, {
            complete: this.updateData,
            header: true,
            skipEmptyLines: true
        });
    };

    //Function to add random color to the bars in the bar chart
    getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 12)];
        }
        return color;
    }

    updateData = (result) => {

        var data = result.data;

        var firstGrade = data.filter(student => {
            return student.Grado === "1"
        })

        var secondGrade = data.filter(student => {
            return student.Grado === "2"
        })

        var thirdGrade = data.filter(student => {
            return student.Grado === "3"
        })
        this.setState({
            dataFromCSV: data,
            studentsFirstGrade: firstGrade,
            studentsSecondGrade: secondGrade,
            studentsThirdGrade: thirdGrade,
            isDataLoaded: true
        })
        this.setGrupos()
        this.getWorstAndBestGrades()
    }

    //stores the scores of the students by his school grade
    setGrupos() {
        const { studentsFirstGrade, studentsSecondGrade, studentsThirdGrade } = this.state
        const gradesFirstGrade = []
        const gradesSecondGrade = []
        const gradesThirdGrade = []
        var GlobalGrades = []

        studentsFirstGrade.forEach(alumno => {
            gradesFirstGrade.push(parseFloat(alumno.Calificacion))
        });

        studentsSecondGrade.forEach(alumno => {
            gradesSecondGrade.push(parseFloat(alumno.Calificacion))
        });

        studentsThirdGrade.forEach(alumno => {
            gradesThirdGrade.push(parseFloat(alumno.Calificacion))
        });

        studentsFirstGrade.forEach(alumno => {
            GlobalGrades.push(parseFloat(alumno.Calificacion))
        })

        studentsSecondGrade.forEach(alumno => {
            GlobalGrades.push(parseFloat(alumno.Calificacion))
        })

        studentsThirdGrade.forEach(alumno => {
            GlobalGrades.push(parseFloat(alumno.Calificacion))
        })

        var average = this.addAndGetAverage(GlobalGrades)
        this.setState({ globalGrades: average.toFixed(2) })

        var sumaPrimerGrado = this.addAndGetAverage(gradesFirstGrade)
        var sumaSegundoGrado = this.addAndGetAverage(gradesSecondGrade)
        var sumaTercerGrado = this.addAndGetAverage(gradesThirdGrade)

        this.setState({
            averageFirstGrade: sumaPrimerGrado,
            averageSecondGrade: sumaSegundoGrado,
            averageThirdGrade: sumaTercerGrado
        })
    }

    getWorstAndBestGrades() {
        //getting the highest score of the students
        const maxValueOfY = Math.max(...this.state.dataFromCSV.map(o => o.Calificacion), 0);

        var CuadroDeHonor = this.state.dataFromCSV.filter(alumno => {
            return alumno.Calificacion == maxValueOfY
        })
        //getting the lowest score of the students
        const minValueOfStudents = Math.min(...this.state.dataFromCSV.map(o => o.Calificacion));

        var CuadroDeHorror = this.state.dataFromCSV.filter(alumno => {
            return alumno.Calificacion == minValueOfStudents
        })

        this.setState({
            studentBestGrade: CuadroDeHonor,
            studentWorstGrade: CuadroDeHorror
        })
    }

    //make a sum of the scores and get the average.
    addAndGetAverage(calif) {
        var suma = calif.reduce(function (sum, value) {
            return sum + value;
        }, 0);
        return suma / calif.length
    }

    render() {

        var worstGrade;
        var bestGrade;
        var Promedio;
        var displayCharts;

        const dataForPieChart = [
            ["Grado", "Calificacion Promedio"],
            ["Primer Grado", this.state.averageFirstGrade],
            ["Segundo Grado", this.state.averageSecondGrade],
            ["Tercer Grado", this.state.averageThirdGrade]
        ];

        const dataForBarChart = [["Alumno", "Calificacion", { role: "style" }],]
        const options = {
            title: "Promedio por grado escolar",
            pieHole: 0.4,
            is3D: true
        };
        const { dataFromCSV } = this.state

        dataFromCSV.forEach(alumno => {
            var color = this.getRandomColor()
            var info = [alumno.Nombres, parseFloat(alumno.Calificacion), color]
            dataForBarChart.push(info)
        });

       if(this.state.isDataLoaded){
           displayCharts = (
        <div>
            <Chart
                    chartType="ColumnChart"
                    width="100%"
                    height="400px"
                    data={dataForBarChart}
                />

                <Chart
                    chartType="PieChart"
                    width="100%"
                    height="400px"
                    data={dataForPieChart}
                    options={options}
                />
           </div> )
       }else{
        displayCharts = (
<div>
            
        </div>)
       }

        if (this.state.globalGrades) {
            Promedio = <h1>Promedio Grupal {this.state.globalGrades}</h1>
        } else {
            Promedio = <h1>Add file to show the average grade</h1>
        }

        if (this.state.studentWorstGrade) {
            worstGrade = <MinimumGrade
                name={this.state.studentWorstGrade[0].Nombres}
                lastName={this.state.studentWorstGrade[0]["Apellido Paterno"]}
                grade={this.state.studentWorstGrade[0].Calificacion} />
            bestGrade = <BestGrade
                name={this.state.studentBestGrade[0].Nombres}
                lastName={this.state.studentBestGrade[0]["Apellido Paterno"]}
                grade={this.state.studentBestGrade[0].Calificacion} />


        } else {
            worstGrade = <p>Upload file to show the Worst grade</p>
            bestGrade = <p>Upload file to show the Best grade</p>
        }


        return (
            <div className="App">
                <h2>Import CSV File!</h2>

                <input
                    className="csv-input"
                    type="file"
                    ref={input => {
                        this.filesInput = input;
                    }}
                    name="file"
                    placeholder={null}
                    onChange={this.handleChange}
                />
                <p />

                {this.state.isFileLoaded ? <Button updateData={this.importCSV} /> : <ButtonDisabled />}

                <div>
                    {Promedio}
                    {bestGrade}
                    {worstGrade}
                </div>
                {displayCharts}

                


            </div>
        );
    }
}

export default FileReader;