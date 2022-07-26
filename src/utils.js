import { notification } from 'antd';

const default_messages = {
  error: 'Error occurred!',
  warning: 'Not enough permissions',
  info: ''
};
const default_descriptions = {
  error: 'Please, contact administrator.',
  warning: 'Please, reload the page! If the issue is still there, contact administrator.',
  info: ''
};

const openNotificationWithIcon = (type, message, description) => {
  const _type = type || 'error';

  return notification[_type]({
    message: message || default_messages[_type],
    description: description || default_descriptions[_type],
    duration: 0
  });
};

export { openNotificationWithIcon };
