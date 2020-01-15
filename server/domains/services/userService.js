/*
 * Created by k_infinity3 <ksupro1@gmail.com>
 * December 2019
 * 
 * userService: () : userModel
 *
 *  implements fucntions necessary for model manipulation
 *
 * Fucntions:
 *      create | insert
 *          -> createNewEmailUser(email, password)
 *              : checks if user exists first with email [.userExists(email)]
 *              : creates new user with email
 *                  and password [_userModel.create(email,password)]
 *              : authenticates the user and sends back a token(string),
 *                  message (string), and result(boolean)
 *      remove | delete
 *      findBy | search
 *          -> authenticateUser(email, password)
 *              : searches the database for the user and compares password
 *              : it then takes the email and password from the database
 *              : creates a jwt with the email and password and sends back
 *          ->userExists
 *              : checks if an email exists in the database
 *      get    | retrieve
 *             | update
 *
 *
 */

import hPassword from '../utils/password'
import userModel from '../models/userModel'
import tokenService from '../services/tokenService'
import winstonLogger from '../../Infrastructure/utils/winstonLogger'
import publicEnums from '../../app/publicEnums'

const userService = {

    // user Data
    /**
     * name,
     * email,
     * password,
     * address, 
     * profileImage,
     * topics
     * birthDate
     */

  // handle for the userModel
  _userModel: userModel,

  // Create new user
  async createNewEmailUser(UserName,Name,Email,Password,Address,ProfileImage,Topics,BirthDate) {
    winstonLogger.info('::userService')

    // Holds return data for this fucntion
    let response = null
    
    // Check if user exists first returns promise resolved to true or false
    await userService.userExists({
      Email,
      UserName
    }).
    then((result) => {

      winstonLogger.info('searching DB for user')
      winstonLogger.info(JSON.stringify(result,null,4))
      // Email exists in database
        response = result

    }).
    catch((e) => {
      
      winstonLogger.info('existence error')
      winstonLogger.error(e)

      Promise.resolve({
        status: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
        statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
        token: null
      })

    })
    // Becomes true if user already exists and we kick out of function
    if (response.value) {

      if(response.typeE == "email"){
        // Return to higher scope if there's a user
        return Promise.resolve({
          state: publicEnums.VC_STATES.RESOURCE_EXISTS,
          statusCode: publicEnums.VC_STATUS_CODES.REQUEST_FAILED,
          statusMessage: publicEnums.VC_STATUS_MESSAGES.SIGNUP_ERROR_EMAILEXISTS,
          token: null
        })
      }else if(response.typeU == "user"){
        return Promise.resolve({
          state: publicEnums.VC_STATES.RESOURCE_EXISTS,
          statusCode: publicEnums.VC_STATUS_CODES.REQUEST_FAILED,
          statusMessage: publicEnums.VC_STATUS_MESSAGES.SIGNUP_ERROR_USEREXISTS,
          token: null
        })
      }

    }
    
    // Create static Data for user
      const userData = {
        "userName": UserName,
        "name": Name,
        "email": Email,
        "password": Password,
        "address": Address,
        "profileImage": ProfileImage
      }
    
      // temp password holder  
      winstonLogger.info("password " + userData.password)
    const ipassword = userData.password

    // Hash user password on first save
    await hPassword.hash(ipassword).
    then((hashedPassword) => {

      // Append Hashed password to static user Data
      userData.password = hashedPassword
      // Create new user model
      const user = new userModel(userData)
    
      // Save new user
      user.
      save().
      then((result) => {

        // Succeeded in saving new user to DB
        winstonLogger.info(' -> user CREATED')
        winstonLogger.info(result)
        result.password =  ipassword
        response = Promise.resolve(result)

      }).
      catch((err) => {

        winstonLogger.error(' -> user NOT CREATED')
        winstonLogger.error(err)

        return Promise.resolve({
          state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
          statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
          statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
          token: null
        })

      })

    }).catch((err) => {

      winstonLogger.error('user PASSWORD NOT HASHED')
      winstonLogger.error(err)  

      response = Promise.resolve({
        state: publicEnums.VC_STATES.HASHING_ERROR,
        statusCode: publicEnums.VC_STATUS_CODES.REQUEST_FAILED,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.HASHING_ERROR,
        token: null
      })

      return response

    })

    // Create and use timeout
    const timeout = (ms) => new Promise((res) => setTimeout(res, ms))
    await timeout(1000)

    return response

  },
  // Authenticate an already existing user
  async authenticateUser(userData) {

    winstonLogger.info('user DATA:')
    winstonLogger.info(JSON.stringify(userData,null,4))
    let response = null
    let response1 = null
    let response2 = null
    let tempData = null
    let id = null

    // Try email
    await userService._userModel.
      findOne({email: userData.detail}).
    then((Data) => {

      winstonLogger.info('Searching for email')
      // Get data from DB
      if(Data) {

        winstonLogger.info('Email found:')
        tempData = Data
        winstonLogger.info(JSON.stringify(Data.email,null,4))
        response1 = true
        id = userData.detail

      }else{response1 = false}

    }).
    catch((err) => {
      
      //
      response1 = false
      winstonLogger.error("Eror searching for email")
      winstonLogger.error(err.message)
      winstonLogger.error(err.stack)

      return Promise.resolve({
        state: publicEnums.VC_STATES.AUTHENTICATION_ERROR,
        statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
        token: null
      })

    })

    // Try Name
    await userService._userModel.
    findOne({userName: userData.detail}).
    then((Data) => {
      
      winstonLogger.info('Searching for username')
      // Get data from DB
      if(Data) {

        winstonLogger.info('userName found:')
        tempData = Data
        winstonLogger.info(Data.userName)
        response2 = true
        id = userData.detail

      }

    }).
    catch((err) => {

      //
      winstonLogger.error('ERROR: searching for name')
      winstonLogger.error(err.message)
      winstonLogger.error(err.stack)

      response2 = false
      
      return Promise.resolve({
        state: publicEnums.VC_STATES.AUTHENTICATION_ERROR,
        statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
        token: null
      })

    })

    if (!(response1 || response2)){

      winstonLogger.info(response1 + " " + response2)
      // Break out
      winstonLogger.info(`ERROR AUTHENTICATING :::`)
      // Return false and and empty object
      return Promise.resolve({
        state: publicEnums.VC_STATES.AUTHENTICATION_ERROR,
        statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INCORRECT_USERNAME,
        token: null
      })

    }
    // User exists -> check password correspondence with bcrypt
    let res = null
  
    await hPassword.compare(userData.password, tempData.password).
    then((matched) => {
    
      // Password matched
      winstonLogger.info(`password matched ? ${matched}`)
      res = matched

    }).
    catch((err) => Promise.reject(err))

    if (!res) {

      response = {
        state: publicEnums.VC_STATES.AUTHENTICATION_ERROR,
        statusCode: publicEnums.VC_STATUS_CODES.NOT_FOUND,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INCORRECT_PASSWORD,
        token: null
      }

      return response

    }
    
    let Token = null
    // Return a boolean(true) and signed JWT
    await Promise.resolve(tokenService.generateToken({
          email: tempData.email,
          userName: tempData.userName,
          userID: tempData._id,
          name: tempData.name,
          address: tempData.address,
          profileImage: tempData.profileImage
    })).
    then((tk) => {

      winstonLogger.info('Generated Token')
      winstonLogger.info(tk)
      Token = tk

    }).
    catch((e) => {
      
      winstonLogger.error('error generating token')
      winstonLogger.error(e)

      return Promise.resolve({
        state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
        statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
        token: null
      })

    })

    winstonLogger.info('TOKEN')
    winstonLogger.info(JSON.stringify(Token))

    // Resolve
    response = Promise.resolve({
      state: publicEnums.VC_STATES.REQUEST_OK,
      statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
      statusMessage: publicEnums.VC_STATUS_MESSAGES.SUCCESSFUL_LOGIN,
      token: Token
    })

    return response

  },

  /*
   * Checks if the user is in the Database without returning anyData
   * returns a boolean based on availability
   */
  async userExists(userE) {

    let eeResult = null
    let eeResult1 = null
    let eeResult2 = null

    // Check email
    await userService.
    _userModel.
    findOne({email: userE.Email}).
    then((Data) => {

      winstonLogger.info(`checking data base for user with email `)
      if(Data){
  
        if (Data.length === 0) {

          winstonLogger.info('no user with email exists')
          eeResult1 = Promise.resolve(false)

        }

        winstonLogger.info(`FOUND: ${Data}`)
        eeResult1 = Promise.resolve(true)
      }

    }).
    catch((err) => {

      winstonLogger.info('error checking database')
      winstonLogger.info(err)
      eeResult1 = Promise.resolve(false)

    })
    // Check Name
    await userService.
    _userModel.
    findOne({userName: userE.UserName}).
    then((Data) => {

      winstonLogger.info(`checking data base for user Name`)
      if(Data) {

        if (Data.length === 0) {

          winstonLogger.info('no user exists with Name ')
          eeResult2 = Promise.resolve(false)

        }

        winstonLogger.info(`FOUND: ${Data}`)
        eeResult2 = Promise.resolve(true)
      }
    }).
    catch((err) => {

      winstonLogger.info('error checking database')
      winstonLogger.info(err)
      eeResult2 = Promise.resolve(false)

    })

    let typeE = null
    let typeU = null

    if(eeResult1){
      typeE = "email"
    }else if(eeResult2){
        typeU = "user"
    }
    return eeResult = {
      value: eeResult1 || eeResult2,
      typeE,
      typeU
    }

  },

  /*
   * Init reset send mail ( verification code | reset token)
   * update passresetkey & keyexpiration in schema
   * return result message (boolean)
   */
  async initPasswordReset(userE) {

    // Email exists result
    let response0 = null

    // Ensure email exists in database
    await userService.userExists(userE).
    then((result) => {

      // Boolean result
      response0 = result

    }).
    catch((err) => winstonLogger.info(err))
    // If no return failure if yes continue
    if (!response0) {

      winstonLogger.info(`${user} does not belongs to a user in database`)

      return Promise.reject(response0)

    }
    // Initialize and get resetDetails
      const verificationPack = await hPassword.initReset(email)
      .then((verPack) => {

          Promise.resolve(verPack)

      })
      .catch((err) => {

          Promise.reject(err)

      })

    // Add email to verificationPack
      winstonLogger.info('this is the RESET data')
    winstonLogger.info(verificationPack)
      verificationPack.email = email

    // Add temporaryData(verificationPack) to user's data in DB
    await userService
      ._userModel.update(verificationPack)
      .then((response) => {

        winstonLogger.info('updated: ')
          winstonLogger.info(response)

      })
      .catch((err) => {

          winstonLogger.info('error updating the user data with reset data ')
          winstonLogger.info(err)
        // Return false and and empty object

          Promise.reject(err)

      })

    // Return value
    return Promise.resolve()

  },

  /*
   * get Profile Info
   */
  async getProfile(UserID) {

    //
    let response = null
    // 
    await userService.
    _userModel.
    findOne({
      _id: UserID
    })
    .then((userData) => {

      if(userData){
          winstonLogger.info('userData : ')
          winstonLogger.info(userData)
          response = {
            userName: userData.userName,
            name: userData.name,
            email: userData.email,
            address: userData.address,
            profileImage: userData.profileImage
          }
      }

    })
    .catch((err) => {

        winstonLogger.error('ERROR getting Profile')
        winstonLogger.error(err.message)

      return Promise.resolve({
        state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
        statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
        Data: null
      })

    })

    return Promise.resolve({
      state: publicEnums.VC_STATES.REQUEST_OK,
      statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
      statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
      Data: response
    })

},

/*
   * update Profile Info
   */
  async updateProfile(UserID,Data) {

    const options  = {
      useFindAndModify: false
    }

    winstonLogger.info('GET: user Info')
    winstonLogger.info(JSON.stringify(Data,null,4))
    //
    let response = null
    // 
    await userService.
    _userModel.
    findOneAndUpdate({
          _id: UserID
        },
        Data,
        options
    )
    .then((userData) => {

      winstonLogger.info('userData : ')
      winstonLogger.info(userData)
      
      response = {
        userName: userData.userName,
        name: userData.name,
        email: userData.email,
        address: userData.address,
        profileImage: userData.profileImage
      }

    })
    .catch((err) => {

        winstonLogger.error('ERROR updating Profile')
        winstonLogger.error(err.message)

      return Promise.resolve({
        state: 'failure',
        statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
        Data: null
      })

    })

    return Promise.resolve({
      state: 'success',
      statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
      statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
      Data: response
    })

  },

  /*
   * Validates verification code and resets the password
   */
    async validatePasswordResetEmail(email, verificationCode, newPassword) {

      winstonLogger.info('ENTERED VALIDATEPASSWORDRESETEMAIL FUNCTION')
    // Find email and verificationCode combination
    await userService._userModel.findOne({
            email,
      verificationCode,
        })
      .then((userData) => {

        winstonLogger.info('userData : ')
        winstonLogger.info(userData)
        // Update passwordfied
          userData.password = newPassword
        // Delete the temporaryData
        userData.verificationCode = null
        userData.verificationCodeExpiration = null
        winstonLogger.info('new userData : ')
        userData.save()
          .catch((err) => {

              winstonLogger.info('error updating password')
              winstonLogger.info(err)

          })
        winstonLogger.info(userData)


      })
      .catch((err) => {

          winstonLogger.info('ERROR updating PASSWORD')

        return Promise.reject(err)

      })

  },

  /*
   * Uses validated resetToken to reset the password
   */
    async validatePasswordResetToken(resetToken, newPassword) {

      winstonLogger.info('ENTERED VALIDATEPASSWORDRESETTOKEN FUNCTION')
    // Find email and verificationCode combination
      await userService._userModel.findOne(resetToken)
      .then((userData) => {

        winstonLogger.info('userData : ')
          winstonLogger.info(userData)
        // Update passwordfied
          userData.password = newPassword
        // Delete the temporaryData
          userData.verificationCode = null
          userData.verificationCodeExpiration = null

      })
      .catch((err) => {

          winstonLogger.info('ERROR updating PASSWORD')

          return Promise.reject(err)

      })

  },

  /*
   * Destroy the Token object from DB so authorisation would fail for all requests
   */
    async logoutUser(Token) {

    // Destroy the token from database
    winstonLogger.info('destroy token')
    //await Promise.resolve(tokenService.killToken(Token))

  },








  //
  async FollowUserID(UserID,FollowUserID){

    //  
    let response = null
    let response1 = null
    let response2 = null 

    // Add to FollowUserID as Follower
    this._userModel.
    findOneAndUpdate(
        {_id: FollowUserID},
        {
          $inc: {followerCount: 1},
          $push: {followers: UserID}
        }
    ).
    then((result) => {

        // 
        winstonLogger.info(' adding follower')
        winstonLogger.info(result)
        response1 = Promise.resolve(result)

    }).
    catch((err) => {

      winstonLogger.error(' -> ERROR adding follower ')
      winstonLogger.error(err)

      return Promise.resolve({
          state: 'failure',
          statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
          statusMessage: publicEnums.VC_STATUS_MESSAGES.HASHING_ERROR
      })

    })

      // Add to UserID as following
      this._userModel.
      findOneAndUpdate(
          {_id: UserID},
          {
            $inc: {followCount: 1},
            $push: {following: FollowUserID}
          }
      ).
      then((result) => {
  
          // 
          winstonLogger.info(' adding follower')
          winstonLogger.info(result)
          response2 = Promise.resolve(result)
  
      }).
      catch((err) => {
  
        winstonLogger.error(' -> ERROR adding follower ')
        winstonLogger.error(err)
  
        return Promise.resolve({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.HASHING_ERROR
        })
  
      })
      
      response = response1 && response2

      // return Topic overview
        return Promise.resolve({
            state: 'success',
            statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
            response
        })

  },
  async UnFollowUserID(UserID,UnFollowUserID){

    //  
    let response = false
    let response1 = null
    let response2 = null 
    
    // Remove from UnFollowUserID as Follower
    this._userModel.
    findOneAndUpdate(
        {_id: UnFollowUserID},
        {
          $inc: {followerCount: 1},
          $pull: {followers: UserID}
        }
    ).
    then((result) => {

        // 
        winstonLogger.info('removing follower')
        winstonLogger.info(result)
        response1 = Promise.resolve(result)

    }).
    catch((err) => {

      winstonLogger.error(' -> ERROR removing follower ')
      winstonLogger.error(err)

      return Promise.resolve({
          state: 'failure',
          statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
          statusMessage: publicEnums.VC_STATUS_MESSAGES.HASHING_ERROR
      })

    })

      // Remove from UserID as following
      this._userModel.
      findOneAndUpdate(
          {_id: UserID},
          {
            $inc: {followCount: 1},
            $push: {following: UnFollowUserID}
          }
      ).
      then((result) => {
  
          // 
          winstonLogger.info(' removing follower')
          winstonLogger.info(result)
          response2 = Promise.resolve(result)
  
      }).
      catch((err) => {
  
        winstonLogger.error(' -> ERROR removing follower ')
        winstonLogger.error(err)
  
        return Promise.resolve({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.HASHING_ERROR
        })
  
      })
      
      if(response1 && response2){
        response = true
      }

      // return Topic overview
        return Promise.resolve({
            state: 'success',
            statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
            response
        })

  },
  //
  async getFollowers(UserID){

    //
    let response = null
    // 
    await userService.
    _userModel.
    findOne({
      _id: UserID
    })
    .then((userData) => {

      winstonLogger.info('userData : ')
      winstonLogger.info(userData)
      
      response.followers = userData.followers
      response.followerCount = userData.followerCount

    })
    .catch((err) => {

        winstonLogger.error('ERROR getting followers')
        winstonLogger.error(err.message)

      return Promise.resolve({
        state: 'failure',
        statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
        Data: null
      })

    })

    return Promise.resolve({
      state: 'success',
      statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
      statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
      Data: response
    })

  },
  //
  async getFollowing(UserID){
       
    //
    let response = null
    // 
    await userService.
    _userModel.
    findOne({
      _id: UserID
    })
    .then((userData) => {

      winstonLogger.info('userData : ')
      winstonLogger.info(userData)
      
      response.following = userData.following
      response.followCount = userData.followCount

    })
    .catch((err) => {

        winstonLogger.error('ERROR getting followers')
        winstonLogger.error(err.message)

      return Promise.resolve({
        state: 'failure',
        statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
        Data: null
      })

    })

    return Promise.resolve({
      state: 'success',
      statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
      statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
      Data: response
    })
    
  },
  //
  async getUserProfile(UserID){
    
    //
    let response = null
    // 
    await userService.
    _userModel.
    findOne({
      _id: UserID
    })
    .then((userData) => {

      winstonLogger.info('userData : ')
      winstonLogger.info(userData)
      
      response = userData

    })
    .catch((err) => {

        winstonLogger.error('ERROR getting profile')
        winstonLogger.error(err.message)

      return Promise.resolve({
        state: 'failure',
        statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
        Data: null
      })

    })

    return Promise.resolve({
      state: 'success',
      statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
      statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
      Data: response
    })

  }

}

export default userService