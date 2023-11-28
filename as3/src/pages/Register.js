import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Spinner } from "react-bootstrap";
import axios from "axios";
import { MD5 } from "crypto-js";
import { service1URL } from "../constants";

function Register() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        location: ""
    });
    const [isLoading, setIsLoading] = useState(false);

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
            .post(service1URL + "/register", {
                name: user.name,
                email: user.email,
                password: hashedPass,
                location: user.location
            })
            .then((response) => {
                if (response.data === "User registered successfully.") {
                    navigate("/login");
                }
            })
            .catch((error) => {
                console.log("Error registering user" + error);
            })
            .finally(() => {
                setIsLoading(false);
            })
    };

    return (
        <div>
            <Container className="mx-auto my-5 py-5 form-container">
                <h2 className="pb-2">Register</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={user.name}
                            onChange={handleUser}
                            required />
                        <Form.Control.Feedback type="invalid">Please provide a name.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="pt-1">Email</Form.Label>
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
                    <Form.Group>
                        <Form.Label className="pt-1">Location</Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={user.location}
                            onChange={handleUser}
                            required />
                        <Form.Control.Feedback type="invalid">Please provide a location.</Form.Control.Feedback>
                    </Form.Group>
                    {
                        isLoading
                            ?
                                <Spinner className="my-3" variant="dark" />
                            :
                            <Button className="my-3" variant="dark" type="submit">
                                Register
                            </Button>
                    }
                </Form>
            </Container>
        </div>
    );
}

export default Register;