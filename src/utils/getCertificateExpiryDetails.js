import { certificatesDictionary as Dict } from 'src/appConstants';
import moment from 'moment';

export const getCertificateExpiryDetails = (expiryDate, isCME = false) => {
  let expiryDays = '';
  let expiryImage = '';
  let expiryColor = '';
  let daysDifference = 0;

  if ((isCME && !expiryDate) || !expiryDate) {
    expiryImage = Dict.full.image;
    expiryColor = Dict.full.color;
  } else {
    daysDifference = moment(expiryDate, 'MM-DD-YYYY').startOf('day').diff(moment().startOf('day'), 'days');
    
    if (daysDifference > 150) {
      expiryImage = Dict.full.image;
      expiryDays = Dict.full.text;
      expiryColor = Dict.full.color;
    } else if (daysDifference > 120) {
      expiryImage = Dict.fullQuarter.image;
      expiryDays = Dict.fullQuarter.text;
      expiryColor = Dict.fullQuarter.color;
    } else if (daysDifference > 90) {
      expiryImage = Dict.goingToExpire.image;
      expiryDays = Dict.goingToExpire.text;
      expiryColor = Dict.goingToExpire.color;
    } else if (daysDifference > 60) {
      expiryImage = Dict.low.image;
      expiryDays = Dict.low.text;
      expiryColor = Dict.low.color;
    } else if (daysDifference >= 30) {
      expiryImage = Dict.lowest.image;
      expiryDays = Dict.lowest.text;
      expiryColor = Dict.lowest.color;
    } else if (daysDifference > 0) {
      expiryImage = Dict.lowest.image;
      expiryColor = Dict.lowest.color;
      expiryDays = daysDifference;
    } else if (daysDifference <= 0) {
      expiryImage = Dict.expired.image;
      expiryColor = Dict.expired.color;
      expiryDays = '';
    }

    if (!expiryDate) {
      expiryImage = Dict.full.image;
      expiryColor = Dict.full.color;
      expiryDays = '';
    }
  }

  expiryDays =
    daysDifference > 0
      ? daysDifference === 1
        ? expiryDays + ' Day'
        : expiryDays + ' Days'
      : expiryDays;

  return {
    expiryDays,
    expiryImage,
    expiryColor,
    daysDifference
  };
};
