import React, { useEffect, useState } from 'react';

/* Redux Imports */
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

/* React forms imports */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Material UI Imports */
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

/* ----------------- Local imports ------------------- */

//IMPORT API REQUEST HANDLER
import { addPostViaAPI, setPostIds } from '../../utils/api/addPost.js';

//IMPORT FORM VALIDATION
import addPostValidationSchema from '../../utils/formValidations/addPost.js';

//IMPORTING REDUX STORE STUFF
import { addPost } from '../../storage/actions/index.js';
import { store } from '../../storage/store.js';
import { selectFullName } from '../../storage/selectors/userNameSelector.js';

//IMPORTING SNACKBAR
import SuccessSnackBar from '../../utils/CreateSuccessSnackBar.jsx';
import { SNACKBAR_SUCCCESS_MESSAGE_TYPE } from '../../globalVars/index.js';

//IMPORTING STYLES
import '../styles/components/AddPost.css';

function AddPost({ author }) {
  const [showSnackbar, setShowSnackbar] = useState(false); //for triggering the 'Post state' popup
  const [postId, setPostId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [postStatus, setPostStatus] = useState({
    status: 'Add post',
    btnColor: 'primary',
    disabled: false,
  });

  const formOptions = { resolver: yupResolver(addPostValidationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  useEffect(() => {
    //generate unique IDs for the upcoming new post
    setPostIds(setPostId, setUserId);

    //initializing the close snackbar timer
    let timer;
    if (showSnackbar) timer = setTimeout(() => setShowSnackbar(false), 5600);

    //on unmount - clear the timer
    return () => clearTimeout(timer);
  }, [showSnackbar]);

  async function submitData(post) {
    await addPostViaAPI(post);
  }

  async function onSubmit(data) {
    setShowSnackbar(true);

    const post = {
      userId: userId,
      author: author.fullName,
      id: postId,
      title: data.title,
      body: data.body,
    };

    store.dispatch(addPost(post));

    try {
      await submitData(post);
      setPostStatus({
        status: 'Success! Post added',
        btnColor: 'default',
        disabled: true,
      });
    } catch (e) {
      setPostStatus({
        status: `'Error': ${e}`,
        btnColor: 'secondary',
        disabled: false,
      });
    }
  }

  return (
    <>
      <h2 className="form___header">Create post</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form___main">
        <TextField
          type="text"
          error={!!errors.title}
          margin="normal"
          variant="outlined"
          className="input___field"
          label="Blogpost Title"
          multiline
          minRows={1}
          maxRows={2}
          {...register('title')}
        />
        {errors.title && <p>Title cannot be empty!</p>}

        <TextField
          type="text"
          error={!!errors.body}
          margin="normal"
          variant="outlined"
          className="input___field"
          label="What's that you would like to share with us today?"
          multiline
          minRows={10}
          maxRows={10}
          {...register('body')}
        />
        {errors.body && <p>{errors.body?.message}</p>}

        <Button
          className="submit___button"
          type="submit"
          color="primary"
          disabled={postStatus.disabled}
          variant="contained"
        >
          {postStatus.status}
        </Button>
        {showSnackbar ? (
          <div>
            <SuccessSnackBar
              id={postId}
              actionType={SNACKBAR_SUCCCESS_MESSAGE_TYPE.ADD}
            />
          </div>
        ) : (
          ''
        )}
      </form>
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  author: selectFullName,
});

export default connect(mapStateToProps)(AddPost);