import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css'

function App() {
  return (
    <div>
      <h1>Todo App</h1>
      <Todo />
    </div>
  );
}

export default withAuthenticator(App);

