const isPrintable = (fileName = '') => {
  const extension = fileName.split('.').pop().toLowerCase();
  const printableObj = {
    printable: false,
    type: '',
  }
  if(extension === 'jpeg' || extension === 'jpg' || extension === 'png' || extension === 'pdf'){
    printableObj.printable = true;
    if(extension === 'pdf'){
      printableObj.type = 'pdf';
    } else {
      printableObj.type = 'image';
    }
  }
  return printableObj;
}

export default isPrintable;
