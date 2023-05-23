exports.accessManager = async ({role, useCase,translate,
    logger,
    CreateError,
    lang,
    db}) => {
    // Fetch the role data from MongoDB
    const RoleFunction = db.methods.Role({
        translate,
        logger,
        CreateError,
        lang,
        })
console.log(role)
    const res = await RoleFunction.findByName(role)
    if(!res.data.role)
    {
        throw new CreateError('No such role exists.');
    }
    const [feature, access] = useCase.split(':');
        const permission = res.data.role.permissions[feature];
        console.log(res.data.role.permissions, feature, access)
        return access === 'view' && (permission === 'view' ||permission === 'edit');
    
  }