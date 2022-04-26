export const sampleSetting = {
  generalPassword: 'abc',
  users: [
    {username: 'amc123', password: ''},
    {username: 'dmonday', password: ''},
    {username: 'dnorman', password: ''},
  ],
  elements: {
    usernameElementSelector: '',
    passwordElementSelector: '',
    submitElementSelector: ''

  },
  categories: [
    {
      name: 'COM',
      generalPassword: 'abc',
      overrideParentUsers: false,
      users: [
        {username: 'amc123', password: ''},
        {username: 'dmonday', password: ''},
        {username: 'dnorman', password: ''},
      ],
      elements: {
        usernameElementSelector: '',
        passwordElementSelector: '',
      },
      subcategories: [
        {
          name: 'TestDev',
          generalPassword: 'abc',
          overrideParentUsers: false,
          elements: {
            usernameElementSelector: '',
            passwordElementSelector: '',
          },
          users: [
            {username: 'amc123', password: ''},
            {username: 'dmonday', password: ''},
            {username: 'dnorman', password: ''},
          ],
          sites: [
            {
              url: 'http://abc.com',
              generalPassword: '',
              overrideParentUsers: false,
              elements: {
                usernameElementSelector: '',
                passwordElementSelector: '',
              },
              users: [
                {username: 'amc123', password: ''},
                {username: 'dmonday', password: ''},
                {username: 'dnorman', password: ''},
              ],
            },
          ],
        },
      ],
    },
  ],
};
/*
interface Elements {
      usernameElementSelector: string;
      passwordElementSelector: string;
      submitElementSelector: string;
}

interface User {
  username: string;
  password?: string;
}

Type UsersList = Array<User>;

interface Site {
  url: string;
  users?: UsersList;
  OverrideParentUsers: boolean
  generalPassword?: string;
  elements?: Elements;
}

interface SubCategory {
  name: string;
  users?: UsersList;
  OverrideParentUsers: boolean
  generalPassword?: string;
  elements?: Elements;
  sites: Array<Site>
}

interface Category {
  name: string;
  users?: UsersList;
  OverrideParentUsers: boolean
  generalPassword?: string;
  elements?: Elements;
  subCategories: Array<SubCategory>
}

interface settings {
  users?: UsersList;
  generalPassword?: string;
  elements?: Elements;
  categories: Array<category>
}
*/
