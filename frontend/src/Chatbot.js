// src/Chatbot.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        socket.on('bot reply', (botResponse) => {
            setMessages((prevMessages) => [...prevMessages, botResponse]);
        });

        return () => {
            socket.off('bot reply');
        };
    }, []);

    const sendMessage = () => {
        if (input.trim()) {
            socket.emit('chat message', input);
            setMessages((prevMessages) => [...prevMessages, `You: ${input}`]);
            setInput('');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.chat}>
                <ul style={styles.messages}>
                    {messages.map((msg, index) => (
                        <li key={index} style={styles.message}>{msg}</li>
                    ))}
                </ul>
                <div style={styles.inputContainer}>
                    <input
                        style={styles.input}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button style={styles.button} onKeyDown={handleKeyDown} onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
    },
    chat: {
        width: '50%',
        maxWidth: '600px',
        minWidth: '300px',
        backgroundColor: '#fff',
        padding: '20px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        borderRadius: '8px',
    },
    messages: {
        listStyleType: 'none',
        padding: '0',
        margin: '0',
        height: '300px',
        overflowY: 'scroll',
        borderBottom: '1px solid #ddd',
        marginBottom: '10px',
    },
    message: {
        padding: '8px',
        borderBottom: '1px solid #eee',
    },
    inputContainer: {
        display: 'flex',
    },
    input: {
        flex: '1',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px 0 0 4px',
    },
    button: {
        padding: '10px 20px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
        borderRadius: '0 4px 4px 0',
        cursor: 'pointer',
    },
};

export default Chatbot;
