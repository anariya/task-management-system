import { useState, useEffect } from 'react';
import SignInForm from '@/components/SignInForm';
import SignUpForm from '@/components/SignUpForm';
import TopMenu from '@/components/TopMenu';
import GroupMenu from '@/components/GroupMenu';
// import { Link } from 'react-router-dom';
import Dashboard from '@/components/Dashboard';
import Calendar from '@/components/Calendar';
import Layout from '@/components/Layout';

export default function Home() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [signedIn, setSignedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [items, setItems] = useState([]);
    const [text, setText] = useState('');
    const [groupSelected, setGroupSelected] = useState(false);
    const [group, setGroup] = useState(null);
    const [userId, setUserId] = useState(null);

    const handleSwitchToSignUp = () => setIsSignUp(true);
    const handleSwitchToSignIn = () => setIsSignUp(false);

/*     useEffect(() => {
        if (signedIn) {
            // Fetch items if the user is signed in
            fetch('/api/items')
                .then((res) => res.json())
                .then((data) => setItems(data));
        }
    }, [signedIn]); */

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('userId');
        const storedUsername = sessionStorage.getItem('username');
        console.log(storedUserId)
        if (storedUserId && storedUsername) {
            setSignedIn(true);
            setUser(storedUsername);
            setUserId(storedUserId);
        }
    }, []);

    const addItem = async () => {
        await fetch('/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });
        setText('');
        const res = await fetch('/api/items');
        const data = await res.json();
        setItems(data);
    };

    const onGroupSelect = groupID => {
        setGroupSelected(true);
        setGroup(groupID);
    }

    const handleSignOut = () => {
        setSignedIn(false);
        setUser(null);
        setUserId(null);
        setGroupSelected(false);
        sessionStorage.clear(); // Clear session storage on log out
    };

    // if (signedIn) {
    //     return (
    //         <div>
    //             {/* <TopMenu />
    //             <input
    //                 type="text"
    //                 value={text}
    //                 onChange={(e) => setText(e.target.value)}
    //             />
    //             <button onClick={addItem}>Add Item</button>
    //             <p>
    //                 {items.map((item, index) => (
    //                     <span key={index}>{item.text} </span>
    //                 ))}
    //             </p> */}
    //             <TopMenu onLogOut={() => {
    //                 setSignedIn(false);

    //             }}/>
    //             {groupSelected ? <Dashboard groupID={group} /> : <GroupMenu currentUser={user} onGroupSelect={onGroupSelect}/>}                
    //         </div>
    //     );
    // }
    if (signedIn) {
        return (
            <div>
                <TopMenu onLogOut={() => {handleSignOut()} }/>
                {groupSelected ? (
                    
                    <Layout groupID={group} />
                  //  <Calendar groupID={group} />
                ) : (
                    
                    <GroupMenu userID={userId} onGroupSelect={onGroupSelect} />
                )}
            </div>
        );
    }

    return (
        <div>
            {isSignUp ? (
                <SignUpForm onSignUp={(username) => {
                    setSignedIn(true);
                    setUser(username);
                    sessionStorage.setItem('username', username);
                }} onSwitchToSignIn={handleSwitchToSignIn} />
            ) : (
                <SignInForm onSignIn={(userId, username) => {
                    setSignedIn(true);
                    setUser(username); // Update username
                    setUserId(userId); // Set userId
                    sessionStorage.setItem('userId', userId); // Save to session storage
                    sessionStorage.setItem('username', username); // Save to session storage

                }} onSwitchToSignUp={handleSwitchToSignUp} />
            )}
        </div>
    );
}
