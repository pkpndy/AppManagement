import React, { useState } from "react";
import "./lobbyStyle.css";
import * as Components from "./LobbyComponent";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LobbyScreen() {
    const [signIn, toggle] = React.useState(true);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Function to handle navigation to room
    const handleSignIn = async (e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);

        try {
            // const response = await axios.post('http://localhost:5000/api/auth/login', {
            //     email,
            //     password
            // });

            navigate(`/dashboard`);
        } catch (error) {
            console.error("Error signing in:", error.message);
            // Handle error (e.g., display error message to the user)
        }
    };

    return (
        <div className="lobby-screen">
            <Components.Container>
                <Components.SignUpContainer signinIn={signIn}>
                    <Components.Form>
                        <Components.Title>Create Account</Components.Title>
                        <Components.Input type="text" placeholder="Name" />
                        <Components.Input type="email" placeholder="Email" />
                        <Components.Input
                            type="password"
                            placeholder="Password"
                        />
                        <Components.Button>Sign Up</Components.Button>
                    </Components.Form>
                </Components.SignUpContainer>

                <Components.SignInContainer signinIn={signIn}>
                    <Components.Form>
                        <Components.Title>Sign in</Components.Title>
                        <Components.Input
                            type="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Components.Input
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Components.Anchor href="#">
                            Forgot your password?
                        </Components.Anchor>
                        <Components.Button type="submit" onClick={handleSignIn}>
                            Sigin In
                        </Components.Button>
                    </Components.Form>
                </Components.SignInContainer>

                <Components.OverlayContainer signinIn={signIn}>
                    <Components.Overlay signinIn={signIn}>
                        <Components.LeftOverlayPanel signinIn={signIn}>
                            <Components.Title>Welcome Back!</Components.Title>
                            <Components.Paragraph>
                                To keep connected with us please login with your
                                personal info
                            </Components.Paragraph>
                            <Components.GhostButton
                                onClick={() => toggle(true)}
                            >
                                Sign In
                            </Components.GhostButton>
                        </Components.LeftOverlayPanel>

                        <Components.RightOverlayPanel signinIn={signIn}>
                            <Components.Title>Hello, Friend!</Components.Title>
                            <Components.Paragraph>
                                Enter Your personal details and start journey
                                with us
                            </Components.Paragraph>
                            <Components.GhostButton
                                onClick={() => toggle(false)}
                            >
                                Sigin Up
                            </Components.GhostButton>
                        </Components.RightOverlayPanel>
                    </Components.Overlay>
                </Components.OverlayContainer>
            </Components.Container>
        </div>
    );
}

export default LobbyScreen;
