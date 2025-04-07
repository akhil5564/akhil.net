import  { useState } from 'react';

const CreateUser = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [error, setError] = useState<string | null>(null);  // Define the error state

  // Handle user type radio button change
  const handleUserTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserType(event.target.value);
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate form inputs before submitting
    if (!name || !username || !password || !userType) {
      setError("All fields are required");
      return;
    }

    const userData = {
      name,
      username,
      password,
      userType,
    };

    try {
      const response = await fetch('http://localhost:5000/newuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("User created successfully!");
        console.log(result);
        setError(null); // Clear any previous error if successful
      } else {
        const result = await response.json();
        setError(result.message || "Failed to create user.");
      }
    } catch (error) {
      setError("Error occurred while submitting the form.");
      console.error(error);
    }
  };

  return (
    <div className="createuser-container">
      <form onSubmit={handleSubmit}>
        <div className="nameandpass">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="usertype-selection">
          <label>
            <input
              type="radio"
              name="usertype"
              value="main"
              checked={userType === 'main'}
              onChange={handleUserTypeChange}
            />
            Main
          </label>
          <label>
            <input
              type="radio"
              name="usertype"
              value="sub"
              checked={userType === 'sub'}
              onChange={handleUserTypeChange}
            />
            Sub
          </label>
        </div>

        {error && <div className="error-message">{error}</div>}  {/* Show error message */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateUser;
