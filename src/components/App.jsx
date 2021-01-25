import React, { useState, useEffect } from "react";
import firebase, { db } from "../firebase";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import RefreshIcon from "@material-ui/icons/Refresh";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "&:hover": {
      background: "rgba(0, 175, 145, 0.07)",
    },
  },
});

function App() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  const classes = useStyles();

  const increment = firebase.firestore.FieldValue.increment(1);
  const decrement = firebase.firestore.FieldValue.increment(-1);

  const countRef = db.collection("countCollection").doc("count");

  const getCount = async () => {
    const doc = await countRef.get();

    if (!doc.exists) {
      countRef.set({
        count: 0,
      });
    }

    countRef.onSnapshot(function (doc) {
      setCount(doc.data().count);
      doc.data().count % 10 === 0 && doc.data().count > 0
        ? setOpen(true)
        : setOpen(false);
    });
  };

  useEffect(() => {
    getCount();
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  function incrementCount() {
    countRef.update({ count: increment });
  }

  function decrementCount() {
    countRef.update({ count: decrement });
  }

  function resetCount() {
    countRef.update({ count: 0 });
  }

  return (
    <div className="container">
      <div className="first-row">
        <IconButton color="secondary" onClick={incrementCount}>
          <AddIcon fontSize="large" />
        </IconButton>
        <p className="counter">{count}</p>
        <IconButton color="primary" onClick={decrementCount}>
          <RemoveIcon fontSize="large" />
        </IconButton>
      </div>
      <div className="second-row">
        <IconButton
          classes={{
            root: classes.root,
          }}
          onClick={resetCount}
        >
          <RefreshIcon className="reset" fontSize="large" />
        </IconButton>
      </div>

      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert variant="filled" severity="info" onClose={handleClose}>
          Email update sent!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
