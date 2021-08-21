export default function validateInfo(values, postText) {
  let errors = {};

 // if (!values.username.trim()) {
 //   errors.username = 'Username is required';
 // }
 // else if (!/^[A-Za-z]+/.test(values.name.trim())) {
 //   errors.name = 'Enter a valid name';
 // }


  if (!values.location) {
    errors.location = 'Location is required';
  }

  if (!values.title) {
    errors.title = 'Title is required';
  }

  if (postText.replace(/<[^>]+>|&[^>]+;/g, '') === "") {
    errors.postText = 'Content is required';
  }


  if (!values.topic) {
    errors.topic = 'Topic is required';
  }



  return errors;
}
