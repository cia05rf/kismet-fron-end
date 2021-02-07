import React from 'react'

//Bootstrap
import { Jumbotron, Container } from 'react-bootstrap';

//Components
import NetworkBackground from '../NetworkBackground/NetworkBackground.js';

function Home() {
    return (
        <Container id="home-header" className="p-3">
            <NetworkBackground>
            </NetworkBackground>
            <Jumbotron className="homeJumbo" >
                <h1 className="header">Welcome to Kismet</h1>
            </Jumbotron>
            <div className="tester">HOWDY!</div>
        </Container>
    )
}

export default Home
