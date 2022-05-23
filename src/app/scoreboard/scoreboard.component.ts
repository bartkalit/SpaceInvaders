import { Component, OnInit } from '@angular/core';
import { InjectSetupWrapper } from '@angular/core/testing';
import { players } from '../Players';

declare var require: any
var $ = require('jquery');

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {
  number: number;
  name: string;
  score: number;
  constructor() { }

  ngOnInit(): void {
    this.DrawResults();
  }
  Scrolltop(){
    $(window).scrollTop(0)
  }

  DrawResults(){
    if(localStorage.getItem("Scoreboard") != null){
      var old_scores = JSON.parse(localStorage.getItem('Scoreboard'));
    }
    else{
      localStorage.setItem('Scoreboard', '[]');
      var old_scores = JSON.parse(localStorage.getItem('Scoreboard'));
    }

    for(let i=0; i<players.length; i++){
      old_scores.push(players[i].name);
      old_scores.push(players[i].score);
    }

    var players_q = (old_scores.length)/2;
    if(old_scores.length >2){
      for(let j=0; j<players_q-1; j++){
        for(let i=0; i<players_q-1; i++){
          var num_point = (2*i)+1;                               // wybieranie i porównywanie tylko wyników z tablicy
          if(JSON.parse(old_scores[num_point])<JSON.parse(old_scores[num_point+2])){
            var buffor = old_scores[num_point];
            old_scores[num_point] = old_scores[num_point+2];
            old_scores[num_point+2] = buffor;
            var name_buffor = old_scores[num_point-1];
            old_scores[num_point-1] = old_scores[num_point+1];
            old_scores[num_point+1] = name_buffor;
          }
        }
      }
    }

    for(let i=0; i<players_q;i++){
      var t_row = document.createElement('tr');
      var t_number = document.createElement('th');
      var t_nick = document.createElement('th');
      var t_score = document.createElement('th');
      var text_number = document.createTextNode((i+1) + '.');
      var text_nick = document.createTextNode(old_scores[(2*i)]);
      var text_score = document.createTextNode(old_scores[(2*i)+1] + " pkt");
      t_number.appendChild(text_number);
      t_nick.appendChild(text_nick);
      t_score.appendChild(text_score);
      
      t_row.appendChild(t_number);
      t_row.appendChild(t_nick);
      t_row.appendChild(t_score);
      document.getElementById('table_info').appendChild(t_row);
    }
  }
}
