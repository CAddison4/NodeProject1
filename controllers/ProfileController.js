const Profile = require("../models/Profile.js");

const ProfileOps = require("../data/ProfileOps");

const _profileOps = new ProfileOps();
const path = require("path");
const e = require("express");
const dataPath = path.join(__dirname, '../public/')


//Index - List of All Profiles
exports.Index = async function (request, response) {
  let profiles = []
  console.log(request.query.search)
  if(!request.query.search){
    profiles = await _profileOps.getAllProfiles();
    console.log("all profiles")
  } else{
    profiles = await _profileOps.getFilteredProfiles(request.query.search);
    console.log(request.query.search)
  }

  response.render("profiles", {
    title: "Express Yourself - Profiles",
    profiles: profiles,
    search: request.query.search,
      });
    
  };

  //Details - Single Profiles
  exports.Detail = async function (request, response) {
    const profileId = request.params.id;
    console.log(`loading single profile by id ${profileId}`);
    let profile = await _profileOps.getProfileById(profileId);
    let profiles = await _profileOps.getAllProfiles();
    
    if (profile) {
      response.render("profile", {
        title: "Express Yourself - " + profile.name,
        profiles: profiles,
        profileId: request.params.id,
        layout: "./layouts/side-bar",
      });
    } else {
      response.render("profiles", {
        title: "Express Yourself - Profiles",
        profiles: [],
      });
    }
  };

  // Handle profile form GET request
exports.Create = async function (request, response) {
    response.render("profile-form", {
      title: "Create Profile",
      errorMessage: "",
      profile_id: null,
      profile: {},
    });
  };

  // Handle profile form GET request
exports.CreateProfile = async function (request, response) {
    // instantiate a new Profile Object populated with form datas.
    let path = ""
    // console.log(request.files.photo)
    if(request.files != null){
      path = dataPath+"images/"+request.files.photo.name;
      request.files.photo.mv(path);
      path = "/images/"+request.files.photo.name;
    }
    else{
      path = "";
    }
    let interests = (request.body.interests).split(",")

    let tempProfileObj = new Profile({
      name: request.body.name,
      interests: interests,
      imagePath: path
    });
    console.log("Boo"+tempProfileObj)
    //
    let responseObj = await _profileOps.createProfile(tempProfileObj);
  
    // if no errors, save was successful
    if (responseObj.errorMsg == "") {
      let profiles = await _profileOps.getAllProfiles();
      console.log(responseObj.obj);
      response.render("profile", {
        title: "Express Yourself - " + responseObj.obj.name,
        profiles: profiles,
        profileId: responseObj.obj._id.valueOf(),
        imagePath: responseObj.imagePath,
        layout: "./layouts/side-bar",
      });
    }
    
    // There are errors. Show form the again with an error message.
    else {
      console.log("An error occured. Item not created.");
      response.render("profile-form", {
        title: "Create Profile",
        profile: responseObj.obj,
        errorMessage: responseObj.errorMsg,
      });
    }
  };

// Handle delete profile GET request
exports.DeleteProfileById = async function (request, response) {
    const profileId = request.params.id;
    console.log(`deleting single profile by id ${profileId}`);
    let deletedProfile = await _profileOps.deleteProfileById(profileId);
    let profiles = await _profileOps.getAllProfiles();
  
    if (deletedProfile) {
      response.render("profiles", {
        title: "Express Yourself - Profiles",
        profiles: profiles,
      });
    } else {
      response.render("profiles", {
        title: "Express Yourself - Profiles",
        profiles: profiles,
        errorMessage: "Error.  Unable to Delete",
      });
    }
  };

// Handle edit profile form GET request
exports.Edit = async function (request, response) {
    const profileId = request.params.id;
    let profileObj = await _profileOps.getProfileById(profileId);
    response.render("profile-form", {
      title: "Edit Profile",
      errorMessage: "",
      profile_id: profileId,
      profile: profileObj,
    });
  };

  // Handle profile edit form submission
exports.EditProfile = async function (request, response) {
    const profileId = request.body.profile_id;
    const profileName = request.body.name;
    const profileInterests = request.body.interests.split(",")
    let path = ""
    // console.log(request.files.photo)
    if(request.files != null){
      path = dataPath+"images/"+request.files.photo.name;
      request.files.photo.mv(path);
      path = "/images/"+request.files.photo.name;
    }
    else{
      path = "";
    }
    const imagePath = path;
  
    // send these to profileOps to update and save the document
    let responseObj = await _profileOps.updateProfileById(profileId, profileName, profileInterests, imagePath);
  
    // if no errors, save was successful
    if (responseObj.errorMsg == "") {
      let profiles = await _profileOps.getAllProfiles();
      response.render("profile", {
        title: "Express Yourself - " + responseObj.obj.name,
        profiles: profiles,
        profileId: responseObj.obj._id.valueOf(),
        layout: "./layouts/side-bar",
      });
    }
    // There are errors. Show form the again with an error message.
    else {
      console.log("An error occured. Item not created.");
      response.render("profile-form", {
        title: "Edit Profile",
        profile: responseObj.obj,
        profileId: profileId,
        errorMessage: responseObj.errorMsg,
      });
    }
  };