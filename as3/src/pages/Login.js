import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Spinner, Modal } from "react-bootstrap";
import axios from "axios";
import { service2URL } from "../constants";
import { MD5 } from "crypto-js";

function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);

    const handleUser = (event) => {
        const { name, value } = event.target;
        setUser((prevValue) => ({
            ...prevValue,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        const hashedPass = MD5(user.password).toString();
        axios
            .post(service2URL + "/login", {
                email: user.email,
                password: hashedPass
            })
            .then((response) => {
                if (response.data.login === "Successfull") {
                    const currentUser = {
                        Name: response.data.Name,
                        Email: response.data.Email
                    };
                    navigate("/home", { state: { currentUser } });
                } else {
                    setShowAlertModal(true);
                }
            })
            .catch((error) => {
                setShowAlertModal(true);
                console.log("Error in log in user" + error);
            })
            .finally(() => {
                setIsLoading(false);
            })
    };

    return (
        <div>
            <Modal show={showAlertModal} onHide={() => setShowAlertModal(false)} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>Incorrect email or password.</Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={() => setShowAlertModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Container className="mx-auto my-5 py-5 form-container">
                <h2 className="pb-2">Login</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={user.email}
                            onChange={handleUser}
                            required />
                        <Form.Control.Feedback type="invalid">Please provide an email address.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="pt-1">Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={user.password}
                            onChange={handleUser}
                            required />
                        <Form.Control.Feedback type="invalid">Please provide password.</Form.Control.Feedback>
                    </Form.Group>
                    {
                        isLoading
                            ?
                            <Spinner className="my-3" variant="dark" />
                            :
                            <Button className="my-3" variant="dark" type="submit">
                                Login
                            </Button>
                    }
                </Form>
            </Container>
        </div>
    );
}

export default Login;