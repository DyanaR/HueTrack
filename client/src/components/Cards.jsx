import React from "react";
import cards from "../assets/cards.json";
import { Component } from "react";

class Cards extends Component {
  render() {
    return (
       <div className="info-grid">
        {cards.map((card) => (
         
            <div key={card.id} className="info-box">
              <div className="img-box"></div>
              <h3>{card.heading}</h3>
              <p className="cards-txt">{card.paragraph}</p>
            </div>
        ))}
        </div>
    );
  }
}

export default Cards;