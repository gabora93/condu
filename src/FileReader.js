import React , { Component } from 'react';
import Papa from 'papaparse';
import Chart from "react-google-charts";


class FileReader extends React.Component {
    constructor() {
      super();
      this.state = {
        csvfile: undefined,
        dataFromCSV: [],
        alumnosPrimerGrado: [],
        promedioPrimerGrado: 0,
        alumnosSegundoGrado: [],
        promedioSegundoGrado: 0,
        alumnosTercerGrado: [],
        promedioTercerGrado: 0,
        alumnoMejorCalificacion: null,
        alumnoPeorCalificacion: null
      };
      this.updateData = this.updateData.bind(this);
    }



  
    handleChange = event => {
      this.setState({
        csvfile: event.target.files[0]
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
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 12)];
        }
        return color;
    }    
  
    updateData(result) {
        console.log(result)
      var data = result.data;
      console.log(data);
      
      var primerGrado = data.filter(alumno =>{
        return alumno.Grado === "1"
    }) 

    var segundoGrado =  data.filter(alumno =>{
        return alumno.Grado === "2"
    }) 

    var tercerGrado = data.filter(alumno =>{
        return alumno.Grado === "3"
    }) 
    this.setState({
        dataFromCSV : data, 
        alumnosPrimerGrado: primerGrado,
        alumnosSegundoGrado: segundoGrado,
        alumnosTercerGrado: tercerGrado
    })


    console.log(this.state)
    this.setGrupos()
     


    }


    setGrupos(){
        console.log('set grupos', this.state.alumnosPrimerGrado)
        const { alumnosPrimerGrado, alumnosSegundoGrado, alumnosTercerGrado } = this.state
        const calificacionesPrimerGrado = []
        const calificacionesSegundoGrado = []
        const calificacionesTerceGrado = []
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
        
        console.log('calificacionesPrimerGrado',calificacionesPrimerGrado)

        // var suma =  calificacionesPrimerGrado.reduce(function(sum, value) {
        //     return sum + value;
        //     }, 0);
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

            var CuadroDeHonor = this.state.dataFromCSV.filter(alumno =>{
                return alumno.Calificacion == maxValueOfY
            }) 

           

            const minValueOfStudents= Math.min(...this.state.dataFromCSV.map(o => o.Calificacion));
            console.log('min',minValueOfStudents)

            var CuadroDeHorror = this.state.dataFromCSV.filter(alumno =>{
                return alumno.Calificacion == minValueOfStudents
            }) 

            this.setState({
                alumnoMejorCalificacion: CuadroDeHonor,
                alumnoPeorCalificacion: CuadroDeHorror
            })
            console.log(maxValueOfY)
            console.log(CuadroDeHonor)




            

    }

    sumar(calif){
        var suma =  calif.reduce(function(sum, value) {
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
        const array = [ ["Alumno", "Calificacion" ,{ role: "style" }],]
        const options = {
            title: "Promedio por grado escolar",
            pieHole: 0.4,
            is3D: true
          };
        const { dataFromCSV } = this.state
        var alumnosPrimerGrado = []
        console.log(dataFromCSV)
        dataFromCSV.forEach(alumno => {
            var color = this.getRandomColor()
            var info = [alumno.Nombres, parseFloat(alumno.Calificacion), color ]

            array.push(info)    
        });

       


       console.log('alumnosPrimerGrado',alumnosPrimerGrado)

    //    var suma = alumnosPrimerGrado.map(item => item.Calificacion).reduce((prev, next) => prev + next);
      





        console.log(array)
     
      console.log(this.state.csvfile);
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
          <button onClick={this.importCSV}> Upload now!</button>
          <div>
          <h1>Cuadro de honor:</h1>
            <h2>Nombre: {this.state.alumnoMejorCalificacion ? this.state.alumnoMejorCalificacion[0].Nombres +' '+ this.state.alumnoMejorCalificacion[0]["Apellido Paterno"] +' '+ this.state.alumnoMejorCalificacion[0]["Apellido Materno"] : ''}</h2>
            <h3>Calificacion: {this.state.alumnoMejorCalificacion ? this.state.alumnoMejorCalificacion[0].Calificacion: ''}</h3>
</div>

            
          <div>

<h1>Cuadro de horror:</h1>
  <h2>Nombre: {this.state.alumnoPeorCalificacion ? this.state.alumnoPeorCalificacion[0].Nombres +' '+ this.state.alumnoPeorCalificacion[0]["Apellido Paterno"] +' '+ this.state.alumnoPeorCalificacion[0]["Apellido Materno"] : ''}</h2>
  <h3>Calificacion: {this.state.alumnoPeorCalificacion ? this.state.alumnoPeorCalificacion[0].Calificacion: ''}</h3>


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