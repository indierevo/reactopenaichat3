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
      isLoading: false,     // Bool to indicate when the POST request is awaiting
    };
  }

  handleInputChange = (event) => {
    this.setState({ userMessage: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();                 // Prevents the page from being reloaded
    this.setState({ isLoading: true });     // Make the loading state true, so that the 'waiting' spinner gets activated

    // Prepare the data for the API request
    const requestData = {
      model: 'gpt-3.5-turbo',   // Type of model to use
      messages: [
        { role: 'user', content: this.state.userMessage },
      ],
    };

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {      // URL of the OpenAI Chat endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer YOUR API KEY HERE',
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
    // Extracting messages, userMessage, and isLoading properties from the state object
    const { messages, userMessage, isLoading } = this.state;
    // Sort messages from newest to oldest
    const sortedMessages = [...messages].reverse();

    return (
      <div className="App-header">
        <div style={{ padding: 30 }}>Welcome to the React OpenAI ChatBot!</div>
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
              <OutputForm data={`Bot:\n${message.content}`} />
            )}
          </div>
        ))}

        </div>
      </div>
    );
  }
}

export default ChatMain;
