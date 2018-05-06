import React, { Component } from 'react';
import moment from 'moment';
import { equals, ifElse, when } from 'ramda';
import Datetime from 'react-datetime';
import './App.css';

class App extends Component {
  state = {
    curTime: null,
    selectedTime: null,
    selectedTimeMs: null,
    timeLeft: null,
    isSelectedTime: false,
    yearsLeft: null,
    monthsLeft: null,
    daysLeft: null,
    hoursLeft: null,
    minutesLeft: null,
    secondsLeft: null
  }

  componentDidMount() {
    this.setState({ curTime: moment().format('YYYY-MM-DD HH:mm:ss') });

    setInterval( () => {
      this.setState({ curTime: moment().format('YYYY-MM-DD HH:mm:ss') });

      if (this.state.selectedTimeMs) {
        const currentTimeMs = moment().toDate().getTime();
        const differenceInMs = this.state.selectedTimeMs.diff(currentTimeMs); 
        const duration = moment.duration(differenceInMs);

        const yearsLeft = duration.years() || ''; 
        const monthsLeft = duration.months() || ''; 
        const daysLeft = duration.days() || ''; 
        const hoursLeft = duration.hours() || ''; 
        const minutesLeft = duration.minutes() || '';
        const secondsLeft = duration.seconds() || '';  

        this.setState({ 
          timeLeft: `${yearsLeft} ${monthsLeft} ${daysLeft} ${hoursLeft} ${minutesLeft} ${secondsLeft}`,
          yearsLeft,
          monthsLeft,
          daysLeft,
          hoursLeft,
          minutesLeft,
          secondsLeft
        })    
      }
    }, 1000)
  }

  onSelectDateTime(datetime) {
    this.setState({ 
      selectedTime: datetime.format('YYYY-MM-DD HH:mm:ss'),
      selectedTimeMs: datetime 
    });
  }

  selectTime = () => {
      this.setState({
        isSelectedTime: true
      })
  }

  renderDatePicker = () => when(
    equals(false),
    () => 
      <div>
        <Datetime input={false} onChange={selectedDateTime => this.onSelectDateTime(selectedDateTime)} />
        { this.state.selectedTime && <button className="app__button" onClick={this.selectTime}>Select { this.state.selectedTime } </button> }
      </div>
  )(this.state.isSelectedTime);
  
  renderTime = () => ifElse(
    equals(false),
    () => <div className="app__select">Select date and time</div>,
    () => 
      <div>
          {this.renderCounter()}
        <div className="app__until">
          until  { this.state.selectedTime }
        </div>
        <button className="app__button" onClick={() => this.resetSelected()}>Reset</button>
      </div>
  )(this.state.isSelectedTime);

  resetSelected = () => {
    this.setState({ 
      selectedTime: null,
      selectedTimeMs: null,
      isSelectedTime: false, 
    });
  }

  renderCounterItem = (valueLeft, name) => when(
    equals(true),
    () => 
    <div className="app__counter-item">
      <div>{valueLeft}</div>
      <div>{name}</div>
    </div>
  )(!!valueLeft);

  renderCounter = () => {
    const { yearsLeft, monthsLeft, daysLeft, hoursLeft, minutesLeft, secondsLeft } = this.state;

    return(<div className="app__counter">
      { this.renderCounterItem(yearsLeft, 'years') }
      { this.renderCounterItem(monthsLeft, 'months') }
      { this.renderCounterItem(daysLeft, 'days') }
      { this.renderCounterItem(hoursLeft, 'hours') }
      { this.renderCounterItem(minutesLeft, 'minutes') }
      { this.renderCounterItem(secondsLeft, 'seconds') }
    </div>)
  }

  render() {
    return (
      <div className="app">
        <header className="app__header">
          <h1 className="app__title">Timer App</h1>
        </header>
        {this.renderTime()}
        {this.renderDatePicker()}
      </div>
    );
  }
}

export default App;
