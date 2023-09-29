exports.grantCalculator = async ({
  role,
  useCase,
  translate,
  logger,
  CreateError,
  lang,
  db,
  responses,
  annexureId,
  FormFunction,
}) => {
  const annexure = await FormFunction.findById(annexureId);
  const annexureName = annexure.data.form.title;
  console.log(annexureName);
  let grantAmount = 0;
  // Fetch the role data from MongoDB

  //For Annexure - I
  if (annexureName == 'Annexure - I') {
    responses.forEach((element) => {
      if (element.quid == '6513d3cb5e6109861940fa15') {
        grantAmount = element.number;
      }
    });
  } else if (annexureName == 'Annexure - II') {
    //For Annexure - II
    responses.forEach((element) => {
      if (element.quid == '64e710cdad2ff960fe164cc8') {
        grantAmount = element.number;
      }
    });
  } else if (annexureName == 'Annexure - III') {
    //For Annexure - III
    responses.forEach((element) => {
      if (element.quid == '64e71164ad2ff960fe1651ba') {
        grantAmount = element.number;
      }
    });
  } else if (annexureName == 'Annexure - IV') {
    //For Annexure - IV
    responses.forEach((element) => {
      if (element.quid == '64e712d4ad2ff960fe165744') {
        console.log('hellooo', element.singleChoice);
        if (element.singleChoice.id === 1692865078080) grantAmount = 4500;
        else if (element.singleChoice.id === 1692865097994) grantAmount = 3000;
        else if (element.singleChoice.id === 1692865111954) grantAmount = 1500;
        else if (element.singleChoice.id === 1692865167372) grantAmount = 7500;
        else if (element.singleChoice.id === 1692865146889) grantAmount = 4500;
        else if (element.singleChoice.id === 1692865174862) grantAmount = 3000;
      }
    });
  } else if (annexureName == 'Annexure - V') {
    //For Annexure - V
    responses.forEach((element) => {
      if (element.quid == '6514055b2f5e56b28f69ba9a') {
        console.log('hellooo', element.singleChoice);
        if (element.singleChoice.id === 1695810892038) grantAmount = 225000;
        else if (element.singleChoice.id === 1695810894047) grantAmount = 75000;
        else if (element.singleChoice.id === 1695810896600) grantAmount = 60000;
        else if (element.singleChoice.id === 1695810900300) grantAmount = 20000;
      }
    });
  } else if (annexureName == 'Annexure - VI') {
    //For Annexure - VI ND
    responses.forEach((element) => {
      if (element.quid == '64e5e337f2a979e4af60092a') {
        grantAmount = element.number;
      }
    });
  } else if (annexureName == 'Annexure - VII') {
    //For Annexure - VII ND
    responses.forEach((element) => {
      if (element.quid == '64e5e337f2a979e4af60092a') {
        grantAmount = element.number;
      }
    });
  } else if (annexureName == 'AWN - Annexure - I') {
    //For AWN - Annexure - I
    responses.forEach((element) => {
      if (element.quid == '64ec7c16f4b343b6cec27a72') {
        grantAmount = element.number;
      }
    });
  } else if (annexureName == 'AWN - Annexure - II') {
    //For AWN - Annexure - II
    return 'NA';
  } else if (annexureName == 'AWN - Annexure - III') {
    //For AWN - Annexure - III
    return 'NA';
  } else if (annexureName == 'AWN - Annexure - IV') {
    //For AWN - Annexure - IV
    return 'NA';
  } else if (annexureName == 'AWN - Annexure - V') {
    //For AWN - Annexure - V
    return 'NA';
  } else if (annexureName == 'AWN - Annexure - VI') {
    //For AWN - Annexure - VI ND
    responses.forEach((element) => {
      if (element.quid == '64ec7c16f4b343b6cec27a72') {
        grantAmount = element.number;
      }
    });
  } else if (annexureName == 'AWN - Annexure - VII') {
    //For AWN - Annexure - VII
    responses.forEach((element) => {
      if (element.quid == '64ef2bae8cb4c0e2bf03c245') {
        grantAmount = element.number;
      }
    });
  } else if (annexureName == 'AWN - Annexure - VIII') {
    //For AWN - Annexure - VIII ND
    responses.forEach((element) => {
      if (element.quid == '64ef2bae8cb4c0e2bf03c245') {
        grantAmount = element.number;
      }
    });
  } else if (annexureName == 'AWN - Annexure - IX') {
    //For AWN - Annexure - IX
    responses.forEach((element) => {
      if (element.quid == '64f015158cb4c0e2bf044b51') {
        grantAmount = element.number;
      }
    });
  }

  return grantAmount;
};
