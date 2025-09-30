/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createBudget = /* GraphQL */ `mutation CreateBudget(
  $condition: ModelBudgetConditionInput
  $input: CreateBudgetInput!
) {
  createBudget(condition: $condition, input: $input) {
    budget
    createdAt
    id
    month
    partner
    updatedAt
    year
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateBudgetMutationVariables,
  APITypes.CreateBudgetMutation
>;
export const createDriver = /* GraphQL */ `mutation CreateDriver(
  $condition: ModelDriverConditionInput
  $input: CreateDriverInput!
) {
  createDriver(condition: $condition, input: $input) {
    aadharNumber
    createdAt
    id
    isActive
    licenseNumber
    maxLoad
    name
    partner
    phoneNumber
    updatedAt
    vehicleNumber
    vehicleSize
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateDriverMutationVariables,
  APITypes.CreateDriverMutation
>;
export const createTodo = /* GraphQL */ `mutation CreateTodo(
  $condition: ModelTodoConditionInput
  $input: CreateTodoInput!
) {
  createTodo(condition: $condition, input: $input) {
    createdAt
    customId
    customerName
    driverName
    expense
    fromLocation
    id
    maxLoad
    notes
    partner
    startDate
    status
    toLocation
    updatedAt
    vehicleNumber
    vehicleSize
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTodoMutationVariables,
  APITypes.CreateTodoMutation
>;
export const deleteBudget = /* GraphQL */ `mutation DeleteBudget(
  $condition: ModelBudgetConditionInput
  $input: DeleteBudgetInput!
) {
  deleteBudget(condition: $condition, input: $input) {
    budget
    createdAt
    id
    month
    partner
    updatedAt
    year
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteBudgetMutationVariables,
  APITypes.DeleteBudgetMutation
>;
export const deleteDriver = /* GraphQL */ `mutation DeleteDriver(
  $condition: ModelDriverConditionInput
  $input: DeleteDriverInput!
) {
  deleteDriver(condition: $condition, input: $input) {
    aadharNumber
    createdAt
    id
    isActive
    licenseNumber
    maxLoad
    name
    partner
    phoneNumber
    updatedAt
    vehicleNumber
    vehicleSize
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteDriverMutationVariables,
  APITypes.DeleteDriverMutation
>;
export const deleteTodo = /* GraphQL */ `mutation DeleteTodo(
  $condition: ModelTodoConditionInput
  $input: DeleteTodoInput!
) {
  deleteTodo(condition: $condition, input: $input) {
    createdAt
    customId
    customerName
    driverName
    expense
    fromLocation
    id
    maxLoad
    notes
    partner
    startDate
    status
    toLocation
    updatedAt
    vehicleNumber
    vehicleSize
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteTodoMutationVariables,
  APITypes.DeleteTodoMutation
>;
export const updateBudget = /* GraphQL */ `mutation UpdateBudget(
  $condition: ModelBudgetConditionInput
  $input: UpdateBudgetInput!
) {
  updateBudget(condition: $condition, input: $input) {
    budget
    createdAt
    id
    month
    partner
    updatedAt
    year
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateBudgetMutationVariables,
  APITypes.UpdateBudgetMutation
>;
export const updateDriver = /* GraphQL */ `mutation UpdateDriver(
  $condition: ModelDriverConditionInput
  $input: UpdateDriverInput!
) {
  updateDriver(condition: $condition, input: $input) {
    aadharNumber
    createdAt
    id
    isActive
    licenseNumber
    maxLoad
    name
    partner
    phoneNumber
    updatedAt
    vehicleNumber
    vehicleSize
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateDriverMutationVariables,
  APITypes.UpdateDriverMutation
>;
export const updateTodo = /* GraphQL */ `mutation UpdateTodo(
  $condition: ModelTodoConditionInput
  $input: UpdateTodoInput!
) {
  updateTodo(condition: $condition, input: $input) {
    createdAt
    customId
    customerName
    driverName
    expense
    fromLocation
    id
    maxLoad
    notes
    partner
    startDate
    status
    toLocation
    updatedAt
    vehicleNumber
    vehicleSize
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTodoMutationVariables,
  APITypes.UpdateTodoMutation
>;
