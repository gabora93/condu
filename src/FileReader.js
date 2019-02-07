import React, { Component } from 'react';
import Papa from 'papaparse';
import Chart from "react-google-charts";
import MinimumGrade from './components/MinimumGrade/MinimumGrade';
import BestGrade from './components/BestGrade/BestGrade';

class FileReader extends Component {
    constructor() {
        super();
        this.state = {
            csvfile: undefined,
            dataFromCSV: [],
            isFileLoaded: false,
            globalGrades: null,
            alumnosPrimerGrado: [],
            promedioPrimerGrado: 0,
            alumnosSegundoGrado: [],
            promedioSegundoGrado: 0,
            alumnosTercerGrado: [],
            promedioTercerGrado: 0,
            alumnoMejorCalificacion: null,
            alumnoPeorCalificacion: null,
            isDataLoaded: false
        };
        this.updateData = this.updateData.bind(this);
    }




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

    getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 12)];
        }
        return color;
    }

    updateData(result) {
        console.log(result)
        var data = result.data;
        console.log(data);

        var primerGrado = data.filter(alumno => {
            return alumno.Grado === "1"
        })

        var segundoGrado = data.filter(alumno => {
            return alumno.Grado === "2"
        })

        var tercerGrado = data.filter(alumno => {
            return alumno.Grado === "3"
        })
        this.setState({
            dataFromCSV: data,
            alumnosPrimerGrado: primerGrado,
            alumnosSegundoGrado: segundoGrado,
            alumnosTercerGrado: tercerGrado
        })


        console.log(this.state)
        this.setGrupos()



    }


    setGrupos() {
        console.log('set grupos', this.state.alumnosPrimerGrado)
        const { alumnosPrimerGrado, alumnosSegundoGrado, alumnosTercerGrado } = this.state
        const calificacionesPrimerGrado = []
        const calificacionesSegundoGrado = []
        const calificacionesTerceGrado = []
        var GlobalGrades = []
        console.log(alumnosPrimerGrado)
        alumnosPrimerGrado.forEach(alumno => {
            calificacionesPrimerGrado.push(parseFloat(alumno.Calificacion))
        });

        alumnosSegundoGrado.forEach(alumno => {
            calificacionesSegundoGrado.push(parseFloat(alumno.Calificacion))
        });

        alumnosTercerGrado.forEach(alumno => {
            calificacionesTerceGrado.push(parseFloat(alumno.Calificacion))
        });

        console.log(alumnosPrimerGrado)
         
        alumnosPrimerGrado.forEach(alumno => {
            GlobalGrades.push(parseFloat(alumno.Calificacion))
        })

        alumnosSegundoGrado.forEach(alumno => {
            GlobalGrades.push(parseFloat(alumno.Calificacion))
        })

        alumnosTercerGrado.forEach(alumno => {
            GlobalGrades.push(parseFloat(alumno.Calificacion))
        })
        


        
    



        console.log(GlobalGrades)

        var globaliti  = this.sumar(GlobalGrades)
        this.setState({globalGrades: globaliti})
        console.log(globaliti)
        console.log(GlobalGrades.length)

        console.log('calificacionesPrimerGrado', calificacionesPrimerGrado)

        var sumaPrimerGrado = this.sumar(calificacionesPrimerGrado)
        var sumaSegundoGrado = this.sumar(calificacionesSegundoGrado)
        var sumaTercerGrado = this.sumar(calificacionesTerceGrado)

        this.setState({
            promedioPrimerGrado: sumaPrimerGrado,
            promedioSegundoGrado: sumaSegundoGrado,
            promedioTercerGrado: sumaTercerGrado
        })
        console.log(this.state)


        const maxValueOfY = Math.max(...this.state.dataFromCSV.map(o => o.Calificacion), 0);

        var CuadroDeHonor = this.state.dataFromCSV.filter(alumno => {
            return alumno.Calificacion == maxValueOfY
        })

        const minValueOfStudents = Math.min(...this.state.dataFromCSV.map(o => o.Calificacion));
        console.log('min', minValueOfStudents)

        var CuadroDeHorror = this.state.dataFromCSV.filter(alumno => {
            return alumno.Calificacion == minValueOfStudents
        })

        this.setState({
            alumnoMejorCalificacion: CuadroDeHonor,
            alumnoPeorCalificacion: CuadroDeHorror
        })
        console.log(maxValueOfY)
        console.log(CuadroDeHonor)

    }

    sumar(calif) {
        console.log(calif)
        var suma = calif.reduce(function (sum, value) {
            return sum + value;
        }, 0);
        return suma / calif.length
    }

    render() {
        const dataGrados = [
            ["Grado", "Calificacion Promedio"],
            ["Primer Grado", this.state.promedioPrimerGrado],
            ["Segundo Grado", this.state.promedioSegundoGrado],
            ["Tercer Grado", this.state.promedioTercerGrado]

        ];
        const array = [["Alumno", "Calificacion", { role: "style" }],]
        const options = {
            title: "Promedio por grado escolar",
            pieHole: 0.4,
            is3D: true
        };
        const { dataFromCSV } = this.state

        console.log(dataFromCSV)
        dataFromCSV.forEach(alumno => {
            var color = this.getRandomColor()
            var info = [alumno.Nombres, parseFloat(alumno.Calificacion), color]

            array.push(info)
        });


        var worstGrade;
        var bestGrade;
        var Promedio;
        if(this.state.globalGrades){
            Promedio = <h1>Promedio Grupal { this.state.globalGrades}</h1>
        }else{
            Promedio = <h1>Add file to show the average grade</h1>
        }
        if (this.state.alumnoPeorCalificacion) {
            worstGrade = <MinimumGrade
                name={this.state.alumnoPeorCalificacion[0].Nombres}
                lastName={this.state.alumnoPeorCalificacion[0]["Apellido Paterno"]}
                grade={this.state.alumnoPeorCalificacion[0].Calificacion} />
            bestGrade = <BestGrade
                name={this.state.alumnoMejorCalificacion[0].Nombres}
                lastName={this.state.alumnoMejorCalificacion[0]["Apellido Paterno"]}
                grade={this.state.alumnoMejorCalificacion[0].Calificacion} />


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
                {this.state.isFileLoaded ? <button onClick={this.importCSV}> Upload now!</button> : <p>Sube un archivo</p>}
                <div>
                    {Promedio}
                    {bestGrade}
                    {worstGrade}
                </div>
                <Chart
                    chartType="ColumnChart"
                    width="100%"
                    height="400px"
                    data={array}
                />

                <Chart
                    chartType="PieChart"
                    width="100%"
                    height="400px"
                    data={dataGrados}
                    options={options}
                />


            </div>
        );
    }
}

export default FileReader;