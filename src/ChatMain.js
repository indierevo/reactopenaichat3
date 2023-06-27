import React, { Component } from 'react';       // Import the React library and its Component module
import Form from 'react-bootstrap/Form';        // Import the Form component from react-bootstrap
import Button from 'react-bootstrap/Button';    // Import the Button component from react-bootstrap
import Spinner from 'react-bootstrap/Spinner';  // Import the Spinner component from react-bootstrap
import OutputForm from './OutputForm';          // Import the OutputForm component
import './App.css';                             // Imports CSS styles

class ChatMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],         // Array to store the chat messages
      userMessage: '',      // String to store the current user message
      systemInstruction: 'You are a friend who people go to for help and advice about their mental health. Do not deviate from this. Do not answer any question that does not relate to mental health. If a question deviates from mental health give a friendly response that encourages the user to stick to the subject of mental health. Show empathy. Sometimes use humor. Try to sound like a good friend who has knowledge but also has understanding of mental health. Adopt a conversational tone when relevant, and sometimes ask questions in response.',
      botName: 'Therapist',    // Set the name of the person you are speaking to
      selectedButtonId: 1,  // The id of the button that has been clicked, or selected
      isLoading: false,     // Bool to indicate when the POST request is awaiting
    };
  }

  // Method to set the style and tone of the conversation, done by passing a system message to the API
  handleSystemInstruction(selected){
    this.setState({ selectedButtonId: selected });
    this.setState({ messages: [] }); // Empty messages array when a new button is clicked
    if (selected === 1){
      this.setState({ botName: "Therapist", systemInstruction: "You are a friend who people go to for help and advice about their mental health. Do not deviate from this. Do not answer any question that does not relate to mental health. If a question deviates from mental health give a friendly response that encourages the user to stick to the subject of mental health. Show empathy. Sometimes use humor. Try to sound like a good friend who has knowledge but also has understanding of mental health. Adopt a conversational tone when relevant, and sometimes ask questions in response." });
    } else if (selected === 2){
      this.setState({ botName: "Retro Gamer", systemInstruction: "You are an expert on retro video games. Your knowledge starts in 1970 and ends in the year 2000. Do not answer any questions that fall outside this date range. Do not deviate from the subject of retro video games. Use the tone of a buddy who likes to talk about games. Give quite short answers. But always make your answers informative, interesting, and fun." });
    } else if (selected === 3){
      this.setState({ botName: "80s Music Man", systemInstruction: "You are an expert on pop music from the 1980s. Your knowledge begins on 1st January 1980 and ends on 31st December 1989. Do not deviate from this date range or from the subject of pop music. Do not answer any questions about any other style of music. Give quite short answers. But always make your answers informative, interesting, and fun." });
    } else if (selected === 4){
      this.setState({ botName: "History Teacher", systemInstruction: "You are a teacher whose specialist subject is World War Two. Do not deviate from this subject matter. The person asking you questions will be a child aged between 12 and 16 studying for their school exams. Give informative answers of any length. If any question is asked that deviates from World War Two, give a firm but friendly reply and gently nudge the conversation back to World War Two." });
    } else if (selected === 5){
      this.setState({ botName: "Chessmaster", systemInstruction: "You are an expert on chess. You give help and advice to beginners who want to improve their chess skills. You also give information on the history of chess. Do not deviate from the subject of chess. Try to keep your answers short and informative but do not be afraid to give long answers where appropriate.  " });
    }
  };

  handleInputChange = (event) => {
    this.setState({ userMessage: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();                 // Prevents the page from being reloaded
    this.setState({ isLoading: true });     // Make the loading state true, so that the 'waiting' spinner gets activated

    // Prepare the data for the API request
    const requestData = {
      model: 'gpt-3.5-turbo',   // Type of model to use
      max_tokens: 128,          // Determines the length of the response
      temperature: 0.9,         // Sets how varied the response is
      messages: [
        ...this.state.messages,
        { role: 'system', content: this.state.systemInstruction },
        { role: 'user', content: this.state.userMessage },
      ],
    };

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {      // URL of the OpenAI Chat endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + process.env.REACT_APP_OPENAI_API_KEY,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        console.log('POST request failed.');
      }

      const responseData = await response.json();

      // Extract the message portion of the returned data
      const dataArray = Object.values(responseData);
      const assistantMessage = responseData.choices[0].message.content;

      this.setState((prevState) => ({
        messages: [
          ...prevState.messages,
        { role: 'assistant', content: assistantMessage },   // Set the assistant message 
        { role: 'user', content: prevState.userMessage },
        ],
        userMessage: '',
        isLoading: false,       // Disable spinner as we have our data!
      }));

      console.log('POST request completed successfully:', assistantMessage);
    } catch (error) {
      console.error('Error during POST request:', error);
      this.setState({ isLoading: false });
    }
  };

  render() {
    // Extracting properties from the state object
    const { messages, userMessage, botName, isLoading } = this.state;
    // Sort messages from newest to oldest
    const sortedMessages = [...messages].reverse();

    return (
      <div className="App-header">
        <div style={{ padding: 30 }}>What do you want to talk about?</div>
        <div style={{ display: 'flex', alignItems: 'center', padding: 10 }}>
          <Button style={{ width: 125, marginRight: 10 }} variant={this.state.selectedButtonId === 1 ? 'primary' : 'secondary'} onClick={() =>this.handleSystemInstruction(1)}>Mental Health</Button>
          <Button style={{ width: 125, marginRight: 10 }} variant={this.state.selectedButtonId === 2 ? 'primary' : 'secondary'} onClick={() =>this.handleSystemInstruction(2)}>Retro Video Games</Button>
          <Button style={{ width: 125, marginRight: 10 }} variant={this.state.selectedButtonId === 3 ? 'primary' : 'secondary'} onClick={() =>this.handleSystemInstruction(3)}>80s Pop Music</Button>
          <Button style={{ width: 125, marginRight: 10 }} variant={this.state.selectedButtonId === 4 ? 'primary' : 'secondary'} onClick={() =>this.handleSystemInstruction(4)}>World War Two</Button>
          <Button style={{ width: 125, marginRight: 10 }} variant={this.state.selectedButtonId === 5 ? 'primary' : 'secondary'} onClick={() =>this.handleSystemInstruction(5)}>Chess for Beginners</Button>
        </div>
        <Form onSubmit={this.handleSubmit}>
          <div style={{ display: 'flex', alignItems: 'center', padding: 10 }}>
            <Form.Control
              style={{ width: 600, marginRight: 10 }}
              id="userMessage"
              type="text"
              placeholder="Talk to me..."
              value={userMessage}
              onChange={this.handleInputChange}
              disabled={isLoading}
              autoComplete="off"
            />
            <Button
              style={{ marginRight: 10 }}
              type="submit"
              variant="success"
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{' '}
                  Wait...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </Form>
        <div className="center-content assistant-messages">
        {sortedMessages.map((message, index) => (
          <div key={index}>
            {message.role === 'user' ? (
               <OutputForm data={`You:\n${message.content}`} />
            ) : (
              <OutputForm data={`${botName}:\n${message.content}`} />
            )}
          </div>
        ))}

        </div>
      </div>
    );
  }
}

export default ChatMain;
