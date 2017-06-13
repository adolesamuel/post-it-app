// Test api that returns first page of website
app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/index.html`));
});
//=======================================

// test api that returns signup Json
app.route('/user/signup')
      res.send(`User: ${user.email} has signed up`);
      res.json { username: req.body.userName,
        Password: req.body.password,
        Email: req.body.mail }
// =============================================

// test api that returns signin json
app.route('/user/signin')

  res.send(`User${user.email} has signed in`);
// =========================================

// test api that returns sign out text
app.route('/user/signout')

  res.send('user signed out');
//==================================================

// test api that creates a group member
app.route('/group')
 groupRef.push({
        groupname: groupName,
        Admin: email,
        groupMembers: { user: req.body.mail },
        groupMessage: { username: req.body.userName,
          message: 'I am the first user ' } });
    } 

res.send(`${user.email} User is not signed in`);

res.send('Group has been created');

// test api that sends messages to group
app.route('/group/:groupId/message')
  const groupKey = req.params.groupId;
  firebase.database().ref(`Groups/${groupKey}/groupMessage/`)
  .push({ user: req.body.mail, message: req.body.message });
  res.send('message sent');
// =================================================

// test api that adds member to group
app.route('/group/:groupId/user')
  const groupKey = req.params.groupId;
  firebase.database().ref(`Groups/${groupKey}/groupMembers/`)
  .push({ user: req.body.mail });
  res.send('user added');
//=======================================================

// Don't forget to join client branch to devlop

