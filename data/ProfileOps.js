const { ProfilingLevel } = require("mongodb");
const Profile = require("../models/Profile.js");

class ProfileOps {

  ProfileOps() {}

  //Get All Profiles
  async getAllProfiles() {
    let profiles = await Profile.find().sort({ name: 1 });
    return profiles;
  }

//Get All Profiles Matching Filter
    async getFilteredProfiles(string) {
      const filter = { name: { $regex: string, $options: "i" } }
        let profiles = await Profile.find(filter).sort({ name: 1 });
        return profiles;
      }

  //Get Profiles By ID
  async getProfileById(id) {
    let profile = await Profile.findById(id);
    return profile;
  }

    
  async createProfile(profileObject) {
    try {
      const error = await profileObject.validateSync();
      if (error) {
        const response = {
          obj: profileObject,
          errorMsg: error.message,
        };
        return response;
      }

      const result = await profileObject.save();
      const response = {
        obj: result,
        errorMsg: "",
      };
      return response;
    } catch (error) {
      const response = {
        obj: profileObject,
        errorMsg: error.message,
      };
      return response;
    }
  }

  async deleteProfileById(id) {
    console.log(`deleting profile by id ${id}`);
    let result = await Profile.findByIdAndDelete(id);
    console.log(result);
    return result;
  }

  async updateProfileById(id, profileName, profileInterests, imagePath) {
    console.log(`updating profile by id ${id}`);
    const profile = await Profile.findById(id);
    console.log("original profile: ", profile);
    profile.name = profileName;
    profile.interests = profileInterests;
    profile.imagePath = imagePath;
    

    let result = await profile.save();
    console.log("updated profile: ", result);
    return {
      obj: result,
      errorMsg: "",
    };
  }
}



module.exports = ProfileOps;
