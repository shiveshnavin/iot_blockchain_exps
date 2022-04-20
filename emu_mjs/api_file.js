var files=[]
exports.read=function(name,contents)
{
    files[name]=contents;
}

exports.write=function(name)
{
    return files[name]
}

