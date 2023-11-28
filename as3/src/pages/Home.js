import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { service3URL } from "../constants";

function Home() {
    const navigate = useNavigate();
    const location = useLocation();

    const { currentUser } = location.state;

    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        axios
            .get(service3URL + "/users")
            .then((response) => {
                setOnlineUsers(response.data.users);
            })
            .catch((error) => {
                console.log("Error fetching users" + error);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, []);

    const logout = () => {
        setIsLoading(true);
        axios
            .post(service3URL + "/logout", {
                email: currentUser.Email,
                name: currentUser.Name
            })
            .then((response) => {
                if (response.data.logout === "Successfull") {
                    navigate("/");
                }
            })
            .catch((error) => {
                console.log("Error in log out user" + error);
            })
            .finally(() => {
                setIsLoading(false);
            })
    };

    return (
        <div>
            <Container className="mx-auto my-5 py-5 form-container">
                {
                    isLoading
                        ?
                        <Spinner className="text-center" variant="dark" />
                        :
                        <div>
                            <h2>{"Hi, " + currentUser.Name + " you are logged in."}</h2>
                            <Button className="my-2" variant="dark" onClick={logout}>
                                Logout
                            </Button>
                            <div className="my-4">
                                <h4 className="font-weight-bold">Here are other users who are online:</h4>
                                <div className="user-name">
                                    <ul>
                                        {
                                            onlineUsers.length > 0 &&
                                            onlineUsers.map((user) => (
                                                <li>{user.Name}</li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                }
            </Container>
        </div>
    );
}

export default Home;