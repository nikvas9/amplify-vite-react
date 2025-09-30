/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Budget = {
  __typename: "Budget",
  budget?: number | null,
  createdAt: string,
  id: string,
  month?: number | null,
  partner?: string | null,
  updatedAt: string,
  year?: number | null,
};

export type Driver = {
  __typename: "Driver",
  aadharNumber?: string | null,
  createdAt: string,
  id: string,
  isActive?: boolean | null,
  licenseNumber?: string | null,
  maxLoad?: string | null,
  name?: string | null,
  partner?: string | null,
  phoneNumber?: string | null,
  updatedAt: string,
  vehicleNumber?: string | null,
  vehicleSize?: string | null,
};

export type Todo = {
  __typename: "Todo",
  createdAt: string,
  customId?: string | null,
  customerName?: string | null,
  driverName?: string | null,
  expense?: number | null,
  fromLocation?: string | null,
  id: string,
  maxLoad?: string | null,
  notes?: string | null,
  partner?: string | null,
  startDate?: string | null,
  status?: string | null,
  toLocation?: string | null,
  updatedAt: string,
  vehicleNumber?: string | null,
  vehicleSize?: string | null,
};

export type ModelBudgetFilterInput = {
  and?: Array< ModelBudgetFilterInput | null > | null,
  budget?: ModelFloatInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  month?: ModelIntInput | null,
  not?: ModelBudgetFilterInput | null,
  or?: Array< ModelBudgetFilterInput | null > | null,
  partner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  year?: ModelIntInput | null,
};

export type ModelFloatInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelIntInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelBudgetConnection = {
  __typename: "ModelBudgetConnection",
  items:  Array<Budget | null >,
  nextToken?: string | null,
};

export type ModelDriverFilterInput = {
  aadharNumber?: ModelStringInput | null,
  and?: Array< ModelDriverFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isActive?: ModelBooleanInput | null,
  licenseNumber?: ModelStringInput | null,
  maxLoad?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelDriverFilterInput | null,
  or?: Array< ModelDriverFilterInput | null > | null,
  partner?: ModelStringInput | null,
  phoneNumber?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  vehicleNumber?: ModelStringInput | null,
  vehicleSize?: ModelStringInput | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelDriverConnection = {
  __typename: "ModelDriverConnection",
  items:  Array<Driver | null >,
  nextToken?: string | null,
};

export type ModelTodoFilterInput = {
  and?: Array< ModelTodoFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  customId?: ModelStringInput | null,
  customerName?: ModelStringInput | null,
  driverName?: ModelStringInput | null,
  expense?: ModelFloatInput | null,
  fromLocation?: ModelStringInput | null,
  id?: ModelIDInput | null,
  maxLoad?: ModelStringInput | null,
  not?: ModelTodoFilterInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelTodoFilterInput | null > | null,
  partner?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  status?: ModelStringInput | null,
  toLocation?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  vehicleNumber?: ModelStringInput | null,
  vehicleSize?: ModelStringInput | null,
};

export type ModelTodoConnection = {
  __typename: "ModelTodoConnection",
  items:  Array<Todo | null >,
  nextToken?: string | null,
};

export type ModelBudgetConditionInput = {
  and?: Array< ModelBudgetConditionInput | null > | null,
  budget?: ModelFloatInput | null,
  createdAt?: ModelStringInput | null,
  month?: ModelIntInput | null,
  not?: ModelBudgetConditionInput | null,
  or?: Array< ModelBudgetConditionInput | null > | null,
  partner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  year?: ModelIntInput | null,
};

export type CreateBudgetInput = {
  budget?: number | null,
  id?: string | null,
  month?: number | null,
  partner?: string | null,
  year?: number | null,
};

export type ModelDriverConditionInput = {
  aadharNumber?: ModelStringInput | null,
  and?: Array< ModelDriverConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  isActive?: ModelBooleanInput | null,
  licenseNumber?: ModelStringInput | null,
  maxLoad?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelDriverConditionInput | null,
  or?: Array< ModelDriverConditionInput | null > | null,
  partner?: ModelStringInput | null,
  phoneNumber?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  vehicleNumber?: ModelStringInput | null,
  vehicleSize?: ModelStringInput | null,
};

export type CreateDriverInput = {
  aadharNumber?: string | null,
  id?: string | null,
  isActive?: boolean | null,
  licenseNumber?: string | null,
  maxLoad?: string | null,
  name?: string | null,
  partner?: string | null,
  phoneNumber?: string | null,
  vehicleNumber?: string | null,
  vehicleSize?: string | null,
};

export type ModelTodoConditionInput = {
  and?: Array< ModelTodoConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  customId?: ModelStringInput | null,
  customerName?: ModelStringInput | null,
  driverName?: ModelStringInput | null,
  expense?: ModelFloatInput | null,
  fromLocation?: ModelStringInput | null,
  maxLoad?: ModelStringInput | null,
  not?: ModelTodoConditionInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelTodoConditionInput | null > | null,
  partner?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  status?: ModelStringInput | null,
  toLocation?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  vehicleNumber?: ModelStringInput | null,
  vehicleSize?: ModelStringInput | null,
};

export type CreateTodoInput = {
  customId?: string | null,
  customerName?: string | null,
  driverName?: string | null,
  expense?: number | null,
  fromLocation?: string | null,
  id?: string | null,
  maxLoad?: string | null,
  notes?: string | null,
  partner?: string | null,
  startDate?: string | null,
  status?: string | null,
  toLocation?: string | null,
  vehicleNumber?: string | null,
  vehicleSize?: string | null,
};

export type DeleteBudgetInput = {
  id: string,
};

export type DeleteDriverInput = {
  id: string,
};

export type DeleteTodoInput = {
  id: string,
};

export type UpdateBudgetInput = {
  budget?: number | null,
  id: string,
  month?: number | null,
  partner?: string | null,
  year?: number | null,
};

export type UpdateDriverInput = {
  aadharNumber?: string | null,
  id: string,
  isActive?: boolean | null,
  licenseNumber?: string | null,
  maxLoad?: string | null,
  name?: string | null,
  partner?: string | null,
  phoneNumber?: string | null,
  vehicleNumber?: string | null,
  vehicleSize?: string | null,
};

export type UpdateTodoInput = {
  customId?: string | null,
  customerName?: string | null,
  driverName?: string | null,
  expense?: number | null,
  fromLocation?: string | null,
  id: string,
  maxLoad?: string | null,
  notes?: string | null,
  partner?: string | null,
  startDate?: string | null,
  status?: string | null,
  toLocation?: string | null,
  vehicleNumber?: string | null,
  vehicleSize?: string | null,
};

export type ModelSubscriptionBudgetFilterInput = {
  and?: Array< ModelSubscriptionBudgetFilterInput | null > | null,
  budget?: ModelSubscriptionFloatInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  month?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionBudgetFilterInput | null > | null,
  partner?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  year?: ModelSubscriptionIntInput | null,
};

export type ModelSubscriptionFloatInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionDriverFilterInput = {
  aadharNumber?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionDriverFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isActive?: ModelSubscriptionBooleanInput | null,
  licenseNumber?: ModelSubscriptionStringInput | null,
  maxLoad?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionDriverFilterInput | null > | null,
  partner?: ModelSubscriptionStringInput | null,
  phoneNumber?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  vehicleNumber?: ModelSubscriptionStringInput | null,
  vehicleSize?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelSubscriptionTodoFilterInput = {
  and?: Array< ModelSubscriptionTodoFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  customId?: ModelSubscriptionStringInput | null,
  customerName?: ModelSubscriptionStringInput | null,
  driverName?: ModelSubscriptionStringInput | null,
  expense?: ModelSubscriptionFloatInput | null,
  fromLocation?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  maxLoad?: ModelSubscriptionStringInput | null,
  notes?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionTodoFilterInput | null > | null,
  partner?: ModelSubscriptionStringInput | null,
  startDate?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  toLocation?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  vehicleNumber?: ModelSubscriptionStringInput | null,
  vehicleSize?: ModelSubscriptionStringInput | null,
};

export type GetBudgetQueryVariables = {
  id: string,
};

export type GetBudgetQuery = {
  getBudget?:  {
    __typename: "Budget",
    budget?: number | null,
    createdAt: string,
    id: string,
    month?: number | null,
    partner?: string | null,
    updatedAt: string,
    year?: number | null,
  } | null,
};

export type GetDriverQueryVariables = {
  id: string,
};

export type GetDriverQuery = {
  getDriver?:  {
    __typename: "Driver",
    aadharNumber?: string | null,
    createdAt: string,
    id: string,
    isActive?: boolean | null,
    licenseNumber?: string | null,
    maxLoad?: string | null,
    name?: string | null,
    partner?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
    vehicleNumber?: string | null,
    vehicleSize?: string | null,
  } | null,
};

export type GetTodoQueryVariables = {
  id: string,
};

export type GetTodoQuery = {
  getTodo?:  {
    __typename: "Todo",
    createdAt: string,
    customId?: string | null,
    customerName?: string | null,
    driverName?: string | null,
    expense?: number | null,
    fromLocation?: string | null,
    id: string,
    maxLoad?: string | null,
    notes?: string | null,
    partner?: string | null,
    startDate?: string | null,
    status?: string | null,
    toLocation?: string | null,
    updatedAt: string,
    vehicleNumber?: string | null,
    vehicleSize?: string | null,
  } | null,
};

export type ListBudgetsQueryVariables = {
  filter?: ModelBudgetFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBudgetsQuery = {
  listBudgets?:  {
    __typename: "ModelBudgetConnection",
    items:  Array< {
      __typename: "Budget",
      budget?: number | null,
      createdAt: string,
      id: string,
      month?: number | null,
      partner?: string | null,
      updatedAt: string,
      year?: number | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListDriversQueryVariables = {
  filter?: ModelDriverFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDriversQuery = {
  listDrivers?:  {
    __typename: "ModelDriverConnection",
    items:  Array< {
      __typename: "Driver",
      aadharNumber?: string | null,
      createdAt: string,
      id: string,
      isActive?: boolean | null,
      licenseNumber?: string | null,
      maxLoad?: string | null,
      name?: string | null,
      partner?: string | null,
      phoneNumber?: string | null,
      updatedAt: string,
      vehicleNumber?: string | null,
      vehicleSize?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListTodosQueryVariables = {
  filter?: ModelTodoFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTodosQuery = {
  listTodos?:  {
    __typename: "ModelTodoConnection",
    items:  Array< {
      __typename: "Todo",
      createdAt: string,
      customId?: string | null,
      customerName?: string | null,
      driverName?: string | null,
      expense?: number | null,
      fromLocation?: string | null,
      id: string,
      maxLoad?: string | null,
      notes?: string | null,
      partner?: string | null,
      startDate?: string | null,
      status?: string | null,
      toLocation?: string | null,
      updatedAt: string,
      vehicleNumber?: string | null,
      vehicleSize?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreateBudgetMutationVariables = {
  condition?: ModelBudgetConditionInput | null,
  input: CreateBudgetInput,
};

export type CreateBudgetMutation = {
  createBudget?:  {
    __typename: "Budget",
    budget?: number | null,
    createdAt: string,
    id: string,
    month?: number | null,
    partner?: string | null,
    updatedAt: string,
    year?: number | null,
  } | null,
};

export type CreateDriverMutationVariables = {
  condition?: ModelDriverConditionInput | null,
  input: CreateDriverInput,
};

export type CreateDriverMutation = {
  createDriver?:  {
    __typename: "Driver",
    aadharNumber?: string | null,
    createdAt: string,
    id: string,
    isActive?: boolean | null,
    licenseNumber?: string | null,
    maxLoad?: string | null,
    name?: string | null,
    partner?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
    vehicleNumber?: string | null,
    vehicleSize?: string | null,
  } | null,
};

export type CreateTodoMutationVariables = {
  condition?: ModelTodoConditionInput | null,
  input: CreateTodoInput,
};

export type CreateTodoMutation = {
  createTodo?:  {
    __typename: "Todo",
    createdAt: string,
    customId?: string | null,
    customerName?: string | null,
    driverName?: string | null,
    expense?: number | null,
    fromLocation?: string | null,
    id: string,
    maxLoad?: string | null,
    notes?: string | null,
    partner?: string | null,
    startDate?: string | null,
    status?: string | null,
    toLocation?: string | null,
    updatedAt: string,
    vehicleNumber?: string | null,
    vehicleSize?: string | null,
  } | null,
};

export type DeleteBudgetMutationVariables = {
  condition?: ModelBudgetConditionInput | null,
  input: DeleteBudgetInput,
};

export type DeleteBudgetMutation = {
  deleteBudget?:  {
    __typename: "Budget",
    budget?: number | null,
    createdAt: string,
    id: string,
    month?: number | null,
    partner?: string | null,
    updatedAt: string,
    year?: number | null,
  } | null,
};

export type DeleteDriverMutationVariables = {
  condition?: ModelDriverConditionInput | null,
  input: DeleteDriverInput,
};

export type DeleteDriverMutation = {
  deleteDriver?:  {
    __typename: "Driver",
    aadharNumber?: string | null,
    createdAt: string,
    id: string,
    isActive?: boolean | null,
    licenseNumber?: string | null,
    maxLoad?: string | null,
    name?: string | null,
    partner?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
    vehicleNumber?: string | null,
    vehicleSize?: string | null,
  } | null,
};

export type DeleteTodoMutationVariables = {
  condition?: ModelTodoConditionInput | null,
  input: DeleteTodoInput,
};

export type DeleteTodoMutation = {
  deleteTodo?:  {
    __typename: "Todo",
    createdAt: string,
    customId?: string | null,
    customerName?: string | null,
    driverName?: string | null,
    expense?: number | null,
    fromLocation?: string | null,
    id: string,
    maxLoad?: string | null,
    notes?: string | null,
    partner?: string | null,
    startDate?: string | null,
    status?: string | null,
    toLocation?: string | null,
    updatedAt: string,
    vehicleNumber?: string | null,
    vehicleSize?: string | null,
  } | null,
};

export type UpdateBudgetMutationVariables = {
  condition?: ModelBudgetConditionInput | null,
  input: UpdateBudgetInput,
};

export type UpdateBudgetMutation = {
  updateBudget?:  {
    __typename: "Budget",
    budget?: number | null,
    createdAt: string,
    id: string,
    month?: number | null,
    partner?: string | null,
    updatedAt: string,
    year?: number | null,
  } | null,
};

export type UpdateDriverMutationVariables = {
  condition?: ModelDriverConditionInput | null,
  input: UpdateDriverInput,
};

export type UpdateDriverMutation = {
  updateDriver?:  {
    __typename: "Driver",
    aadharNumber?: string | null,
    createdAt: string,
    id: string,
    isActive?: boolean | null,
    licenseNumber?: string | null,
    maxLoad?: string | null,
    name?: string | null,
    partner?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
    vehicleNumber?: string | null,
    vehicleSize?: string | null,
  } | null,
};

export type UpdateTodoMutationVariables = {
  condition?: ModelTodoConditionInput | null,
  input: UpdateTodoInput,
};

export type UpdateTodoMutation = {
  updateTodo?:  {
    __typename: "Todo",
    createdAt: string,
    customId?: string | null,
    customerName?: string | null,
    driverName?: string | null,
    expense?: number | null,
    fromLocation?: string | null,
    id: string,
    maxLoad?: string | null,
    notes?: string | null,
    partner?: string | null,
    startDate?: string | null,
    status?: string | null,
    toLocation?: string | null,
    updatedAt: string,
    vehicleNumber?: string | null,
    vehicleSize?: string | null,
  } | null,
};

export type OnCreateBudgetSubscriptionVariables = {
  filter?: ModelSubscriptionBudgetFilterInput | null,
};

export type OnCreateBudgetSubscription = {
  onCreateBudget?:  {
    __typename: "Budget",
    budget?: number | null,
    createdAt: string,
    id: string,
    month?: number | null,
    partner?: string | null,
    updatedAt: string,
    year?: number | null,
  } | null,
};

export type OnCreateDriverSubscriptionVariables = {
  filter?: ModelSubscriptionDriverFilterInput | null,
};

export type OnCreateDriverSubscription = {
  onCreateDriver?:  {
    __typename: "Driver",
    aadharNumber?: string | null,
    createdAt: string,
    id: string,
    isActive?: boolean | null,
    licenseNumber?: string | null,
    maxLoad?: string | null,
    name?: string | null,
    partner?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
    vehicleNumber?: string | null,
    vehicleSize?: string | null,
  } | null,
};

export type OnCreateTodoSubscriptionVariables = {
  filter?: ModelSubscriptionTodoFilterInput | null,
};

export type OnCreateTodoSubscription = {
  onCreateTodo?:  {
    __typename: "Todo",
    createdAt: string,
    customId?: string | null,
    customerName?: string | null,
    driverName?: string | null,
    expense?: number | null,
    fromLocation?: string | null,
    id: string,
    maxLoad?: string | null,
    notes?: string | null,
    partner?: string | null,
    startDate?: string | null,
    status?: string | null,
    toLocation?: string | null,
    updatedAt: string,
    vehicleNumber?: string | null,
    vehicleSize?: string | null,
  } | null,
};

export type OnDeleteBudgetSubscriptionVariables = {
  filter?: ModelSubscriptionBudgetFilterInput | null,
};

export type OnDeleteBudgetSubscription = {
  onDeleteBudget?:  {
    __typename: "Budget",
    budget?: number | null,
    createdAt: string,
    id: string,
    month?: number | null,
    partner?: string | null,
    updatedAt: string,
    year?: number | null,
  } | null,
};

export type OnDeleteDriverSubscriptionVariables = {
  filter?: ModelSubscriptionDriverFilterInput | null,
};

export type OnDeleteDriverSubscription = {
  onDeleteDriver?:  {
    __typename: "Driver",
    aadharNumber?: string | null,
    createdAt: string,
    id: string,
    isActive?: boolean | null,
    licenseNumber?: string | null,
    maxLoad?: string | null,
    name?: string | null,
    partner?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
    vehicleNumber?: string | null,
    vehicleSize?: string | null,
  } | null,
};

export type OnDeleteTodoSubscriptionVariables = {
  filter?: ModelSubscriptionTodoFilterInput | null,
};

export type OnDeleteTodoSubscription = {
  onDeleteTodo?:  {
    __typename: "Todo",
    createdAt: string,
    customId?: string | null,
    customerName?: string | null,
    driverName?: string | null,
    expense?: number | null,
    fromLocation?: string | null,
    id: string,
    maxLoad?: string | null,
    notes?: string | null,
    partner?: string | null,
    startDate?: string | null,
    status?: string | null,
    toLocation?: string | null,
    updatedAt: string,
    vehicleNumber?: string | null,
    vehicleSize?: string | null,
  } | null,
};

export type OnUpdateBudgetSubscriptionVariables = {
  filter?: ModelSubscriptionBudgetFilterInput | null,
};

export type OnUpdateBudgetSubscription = {
  onUpdateBudget?:  {
    __typename: "Budget",
    budget?: number | null,
    createdAt: string,
    id: string,
    month?: number | null,
    partner?: string | null,
    updatedAt: string,
    year?: number | null,
  } | null,
};

export type OnUpdateDriverSubscriptionVariables = {
  filter?: ModelSubscriptionDriverFilterInput | null,
};

export type OnUpdateDriverSubscription = {
  onUpdateDriver?:  {
    __typename: "Driver",
    aadharNumber?: string | null,
    createdAt: string,
    id: string,
    isActive?: boolean | null,
    licenseNumber?: string | null,
    maxLoad?: string | null,
    name?: string | null,
    partner?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
    vehicleNumber?: string | null,
    vehicleSize?: string | null,
  } | null,
};

export type OnUpdateTodoSubscriptionVariables = {
  filter?: ModelSubscriptionTodoFilterInput | null,
};

export type OnUpdateTodoSubscription = {
  onUpdateTodo?:  {
    __typename: "Todo",
    createdAt: string,
    customId?: string | null,
    customerName?: string | null,
    driverName?: string | null,
    expense?: number | null,
    fromLocation?: string | null,
    id: string,
    maxLoad?: string | null,
    notes?: string | null,
    partner?: string | null,
    startDate?: string | null,
    status?: string | null,
    toLocation?: string | null,
    updatedAt: string,
    vehicleNumber?: string | null,
    vehicleSize?: string | null,
  } | null,
};
