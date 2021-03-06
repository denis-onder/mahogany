import { UserQueryParams } from "./../domain/User";
import argon2 from "argon2";
import userValidator from "../validators/userValidator";
import { IUser, UserModel } from "../domain/User";
import BaseService from "../domain/BaseService";
import { FilterQuery } from "mongoose";
import { PaginatedResponse } from "../domain/PaginatedResponse";

export default class UserService implements BaseService<IUser> {
  async create(payload: IUser): Promise<IUser> {
    const validatorResponse = userValidator(payload);

    if (!validatorResponse.valid) {
      throw new Error(JSON.stringify(validatorResponse.errors));
    }

    const alreadyExists = await this.checkIfUserExists(
      payload.email,
      payload.username
    );

    if (alreadyExists) {
      throw new Error("This user already exists.");
    }

    payload.password = await argon2.hash(payload.password);

    const user = new UserModel(payload);
    return await user.save();
  }
  async find(params: UserQueryParams): Promise<PaginatedResponse<IUser>> {
    let query: FilterQuery<IUser> = {};

    if (params.name) {
      query = {
        $and: [
          {
            $or: [
              { firstName: { $regex: params.name, $options: "i" } },
              { lastName: { $regex: params.name, $options: "i" } },
              { username: { $regex: params.name, $options: "i" } },
              { email: { $regex: params.name, $options: "i" } },
            ],
          },
        ],
      };
    }

    if (params.status) {
      if (query["$and"]) {
        query["$and"].push({ status: params.status });
      } else {
        query["$and"] = [{ status: params.status === "true" }];
      }
    }

    const results = await UserModel.find(query)
      .limit(params.limit * 1)
      .skip((params.page - 1) * params.limit)
      .select("-password")
      .exec();

    const count = await UserModel.find(query).count();

    return {
      count,
      currentPage: params.page,
      results,
      totalPages: count / params.limit,
    };
  }
  async findById(id: string): Promise<IUser | null> {
    if (!id) {
      return Promise.resolve(null);
    }

    return await UserModel.findById(id)
      .populate("permissions")
      .select("-password");
  }
  async update(id: string, payload: Partial<IUser>): Promise<IUser | null> {
    const user = await UserModel.findById(id);

    if (!user) return null;

    if (payload.firstName) {
      user.firstName = payload.firstName;
    }

    if (payload.lastName) {
      user.lastName = payload.lastName;
    }

    if (payload.email) {
      user.email = payload.email;
    }

    if (payload.username) {
      user.username = payload.username;
    }

    // payload.status === false will resolve to a falsy value, hence why we have to hard/check for null/undefined values
    if (payload.status !== undefined || payload.status !== null) {
      user.status = payload.status as boolean;
    }

    if (payload.password) {
      payload.password = await argon2.hash(payload.password);
    }

    await user.save();

    return user;
  }
  async delete(id: string): Promise<boolean> {
    if (!id) {
      return Promise.resolve(false);
    }

    const user = await UserModel.findById(id);

    if (!user) {
      return false;
    }

    await user.delete();

    return true;
  }

  private async checkIfUserExists(
    email: string,
    username: string
  ): Promise<boolean> {
    const queryByEmail = await UserModel.findOne({ email });
    const queryByUsername = await UserModel.findOne({ username });

    return !!queryByEmail || !!queryByUsername;
  }
}
