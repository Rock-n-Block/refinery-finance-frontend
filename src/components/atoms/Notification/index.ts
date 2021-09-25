import { notification } from 'antd';

import 'antd/lib/notification/style/css';

import { ArgsProps } from 'antd/lib/notification';

export default notification;

export const successNotification = (title: string, description?: string, ...props: ArgsProps[]) => {
  notification.success({
    message: title,
    description,
    ...props,
  });
};

export const errorNotification = (title: string, description?: string, ...props: ArgsProps[]) => {
  notification.error({
    message: title,
    description,
    ...props,
  });
};
