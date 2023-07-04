import axios from "axios";
import React, { useEffect, useState } from "react";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      jokes: [],
      numJokesToGet: this.props.numJokesToGet || 10
    }
    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.getJokes = this.getJokes.bind(this);
    this.vote = this.vote.bind(this);
  }

  async getJokes() {
    let jokes = [];
    while (jokes.length < this.state.numJokesToGet){
      let res = await axios.get("https://icanhazdadjoke.com",
      {headers: {Accept: "application/json"}})
      let {status, ...jokeObj} = res.data;
      jokes.push({...jokeObj, votes: 0});
    }
    this.setState({jokes: jokes})
  }

  generateNewJokes(){
    this.getJokes();
  }

  componentDidMount(){
    this.getJokes();
  }


  vote(id, delta){
    this.setState(prevState => ({
      jokes: prevState.jokes.map(joke => (
        joke.id === id ? {...joke, votes: joke.votes + delta} : joke))
    }))
  }


  render(){
    if(this.state.jokes.length === 0){
      return null;
    }

    let sortedJokes = [...this.state.jokes].sort((a,b) => b.votes - a.votes);

    return (
      <div className="JokeList">
        <button className="JokeList-getmore" onClick={this.generateNewJokes}>Get New Jokes</button>
        {sortedJokes.map(joke => (
          <Joke
            id={joke.id}
            key={joke.id}
            text={joke.joke}
            votes={joke.votes}
            vote={this.vote}
          />
        ))}
      </div>
    );
  }
}




export default JokeList;
