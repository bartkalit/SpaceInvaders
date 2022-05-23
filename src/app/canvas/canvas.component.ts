import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { aliens } from '../Aliens';

declare var require: any
var $ = require('jquery');
import '../../../node_modules/jquery-ui/jquery-ui.js';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  
  alien = aliens[0];
  howManyLifes: number = 4;
  random: number;
  score: number = 0;
  defeat: number = 0;
  result: boolean = false; 
  name_given: boolean = false;
  override: boolean = false;
  finished: boolean = false;
  nick: string;
  green_button: string = "../../assets/Img/green.png";
  red_button: string = "../../assets/Img/red.png";
  result_img: string;
  constructor() { }

  ngOnInit(): void {
    $( function() {
      var availableTags = [
        "ADAM",
        "BARBARA",
        "CELINA",
        "DOROTA",
        "EDWARD",
        "FILIP",
        "GUSTAW",
        "HENRYK",
        "IGNACY",
        "Krystyna",
        "ActionScript",
        "AppleScript",
        "Asp",
        "BASIC",
        "C",
        "C++",
        "Clojure",
        "COBOL",
        "ColdFusion",
        "Erlang",
        "Fortran",
        "Groovy",
        "Haskell",
        "Java",
        "JavaScript",
        "Lisp",
        "Perl",
        "PHP",
        "Python",
        "Ruby",
        "Scala",
        "Scheme"
      ];
      $( "#tags" ).autocomplete({
        source: availableTags,
        appendTo: "#container"
      });
    } );
  }
  
  RandomAlien(){
    this.random = Math.floor(Math.random()*aliens.length);
    let unique = true;
    if(sessionStorage.getItem('List') == null){
      sessionStorage.setItem('List', '[]');
    }
    else{
      var alien_list = JSON.parse(sessionStorage.getItem('List'));
      if(alien_list.length < aliens.length){
        for(let i=0; i<alien_list.length; i++){
          if(aliens[this.random].name == alien_list[i]){
            unique = false;
            this.RandomAlien();
          }
        }
        if(unique){
          this.alien = aliens[this.random];
        }
      }
      else{
        this.finished = true;
        this.save();
      }
    }
  }
  
  whatsthename(name: string){
    if(name != ''){
      this.name_given = true;
      this.nick = name;
      sessionStorage.removeItem('List');
      this.reset();
      this.instruction();
    }
    else{
      alert("You need to write your name!");
    }
  }

  save(){
    if(localStorage.getItem('Scoreboard') == null){
      localStorage.setItem('Scoreboard', '[]');
    }
    var old_nicks = JSON.parse(localStorage.getItem('Scoreboard'));

    for(var i=0; i<old_nicks.length; i+=2){ //sprawdza czy podany nick juz wystapil
      if(old_nicks[i]==this.nick){
        if(JSON.parse(old_nicks[i+1])<this.score){ //jezeli tak i mial mniejszy score to nadpisze zapisany
          old_nicks[i+1] = JSON.stringify(this.score);
        }
        this.override = true;
      }
    }

    if(!this.override){
      old_nicks.push(this.nick)
      old_nicks.push(JSON.stringify(this.score));
    }
    

    this.override = false
    localStorage.setItem('Scoreboard', JSON.stringify(old_nicks));
  }

  reset(){
    if(this.nick){
      this.save();
    }
    this.defeat = 0;
    this.score=0;
  }

  ListofAliens(){
    if(sessionStorage.getItem('List') == null){
      sessionStorage.setItem('List', '[]');
    }
    var alien_list = JSON.parse(sessionStorage.getItem('List'));
    alien_list.push(this.alien.name)
    sessionStorage.setItem('List', JSON.stringify(alien_list));
    
    this.RandomAlien();
  }

  ButtonCheck(button:number){
    if(!button){
      this.green_button = "../../assets/Img/green_pushed.png";
      setTimeout(()=>{this.green_button = "../../assets/Img/green.png"}, 500);
    }
    else{
      this.red_button = "../../assets/Img/red_pushed.png";
      setTimeout(()=>{this.red_button = "../../assets/Img/red.png"}, 500);
    }
    if(this.alien.type == "good"){
      if(!button){
        this.score++;
        this.DisplayResult(true);
      }
      else this.DisplayResult(false);
    }
    else{
      if(button){
        this.score++;
        this.DisplayResult(true);
      }
      else this.DisplayResult(false);
    }
  }

  DisplayResult(verdict:boolean){
    this.result = true;
    if(verdict){
      setTimeout(()=>{
        this.result_img= "../../assets/Img/passed.png"; 
        document.getElementById("score").innerHTML = "SCORE: " + this.score;
      }, 500);
      setTimeout(()=>{
        this.result_img = "";
        this.result = false;
        this.ListofAliens();
      }, 1500);
    }
    else{
      setTimeout(()=>{this.result_img= "../../assets/Img/lose.png"}, 500);
      setTimeout(()=>{
        this.result_img= "";
        this.result = false;
      }, 2200);

      this.defeat++;
      
      if(this.defeat == this.howManyLifes){
        setTimeout(()=>{
          this.reset();
          this.name_given = false;
        }, 2200);
      }
      else{
        setTimeout(()=>{
          document.getElementById("life" + this.defeat).style.opacity = "0.5";
          this.ListofAliens();
        }, 2200);
      }
    }
    this.save();
  }

  instruction(){
    $( function() {
      $( "#dialog" ).dialog({
        minHeight: 200,
        minWidth: 300,
        maxHeight: 500,
        maxWidth: 600,
        show: { effect: "blind", duration: 800 }
      });
    } );
  }
}
