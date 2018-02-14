package ncadvanced2018.groupeone.parent.service.impl;

import ncadvanced2018.groupeone.parent.dao.UserDao;
import ncadvanced2018.groupeone.parent.entity.User;
import ncadvanced2018.groupeone.parent.exception.EntityExistsException;
import ncadvanced2018.groupeone.parent.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class UserServiceImpl implements UserService{

    private UserDao userDao;

    @Autowired
    public UserServiceImpl(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public User addUser(User user) {
        Assert.notNull(user, "user must not be null");
        if (user.getId() != null){
            throw new EntityExistsException(String.format("user with id: %s exist", user.getId()));
        }
        return userDao.create(user);
    }

    @Override
    public User getUserByEmail(String email) {
        return null;
    }

    @Override
    public User getById(Long id) {
        return userDao.findById(id);
    }
}