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
      systemInstruction: 'You are my best buddy. Chat with me in a friendly way. Ask me how I am doing.',
      botName: 'Friend',    // Set the name of the person you are speaking to
      selectedButtonId: 1,  // The id of the button that has been clicked, or selected
      isLoading: false,     // Bool to indicate when the POST request is awaiting
    };
  }

  // Method to set the style and tone of the conversation, done by passing a system message to the API
  handleSystemInstruction(selected){
    this.setState({ selectedButtonId: selected });
    this.setState({ messages: [] }); // Empty messages array when a new button is clicked
    if (selected === 1){
      this.setState({ botName: "Friend", systemInstruction: "You are my best buddy. Chat with me in a friendly way. Ask me how I am doing." });
    } else if (selected === 2){
      this.setState({ botName: "Mr Burns", systemInstruction: "You are Mr Burns from The Simpsons. Always answer questions in the tone and style of this character. Be unpleasant, rude, sarcastic." });
    } else if (selected === 3){
      this.setState({ botName: "Shakespeare", systemInstruction: "You are William Shakespeare. Always answer questions in the tone and style of him. Include quotes from his plays in your answers, where relevant." });
    } else if (selected === 4){
      this.setState({ botName: "SpongeBob", systemInstruction: "You are SpongeBob Squarepants. Always answer questions in the tone and style of this character. Be excitable, manic, friendly." });
    } else if (selected === 5){
      this.setState({ botName: "Lao Tzu", systemInstruction: "You are Lao Tzu. Always answer questions in the tone and style of him. Include his quotes in your answers where relevant." });
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
      const msg = Object.values(dataArray[5]);
      const msg1 = Object.values(msg[0]);
      const msg2 = Object.values(msg1[0]);
      const assistantMessage = msg2[1];

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
        <div style={{ padding: 30 }}>Who do you want to talk to?</div>
        <div style={{ display: 'flex', alignItems: 'center', padding: 10 }}>
          <Button style={{ width: 125, marginRight: 10 }} variant={this.state.selectedButtonId === 1 ? 'primary' : 'secondary'} onClick={() =>this.handleSystemInstruction(1)}>Friend</Button>
          <Button style={{ width: 125, marginRight: 10 }} variant={this.state.selectedButtonId === 2 ? 'primary' : 'secondary'} onClick={() =>this.handleSystemInstruction(2)}>Mr Burns</Button>
          <Button style={{ width: 125, marginRight: 10 }} variant={this.state.selectedButtonId === 3 ? 'primary' : 'secondary'} onClick={() =>this.handleSystemInstruction(3)}>Shakespeare</Button>
          <Button style={{ width: 125, marginRight: 10 }} variant={this.state.selectedButtonId === 4 ? 'primary' : 'secondary'} onClick={() =>this.handleSystemInstruction(4)}>SpongeBob</Button>
          <Button style={{ width: 125, marginRight: 10 }} variant={this.state.selectedButtonId === 5 ? 'primary' : 'secondary'} onClick={() =>this.handleSystemInstruction(5)}>Lao Tzu</Button>
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
