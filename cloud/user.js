exports.beforeSave = beforeSave;

function beforeSave(request, response) {
  if (request.object.isNew()) {
    return response.success();
  }
  // var validation = validate(request.object);
  // if (!validation.result) {
  //   return response.error(validation.message);
  // }
  return response.success();
}

function validate(user) {
  if (!user.get('username')) {
    return { result: false, message: 'username is not defined.' };
  }
  if (!user.get('email')) {
    return { result: false, message: 'email is not defined.' };
  }
  if (!user.get('gender')) {
    return { result: false, message: 'gender is not defined.' };
  }
  if (!user.get('name')) {
    return { result: false, message: 'name is not defined.' };
  }
  if (!user.get('birthDate')) {
    return { result: false, message: 'birthDate is not defined.' };
  }
  if (!user.get('photo')) {
    return { result: false, message: 'photo is not defined.' };
  }
  if (!user.get('describes') || !user.get('describes').length) {
    return { result: false, message: 'describes is not defined.' };
  }
  return { result: true };
}
