/**
* Generated code, DO NOT modify directly.
*/
/* eslint-disable @typescript-eslint/no-empty-interface */

export interface AttributeObjectObject {
  association?: boolean;
  collection?: boolean;
  declaringType?: ManagedTypeObject1;
  javaMember?: {
};
  javaType?: {
};
  name?: string;
  persistentAttributeType?: PersistentAttributeType;
}

export interface AttributeSuperObjectObject {
  association?: boolean;
  collection?: boolean;
  declaringType?: ManagedTypeSuperObject;
  javaMember?: {
};
  javaType?: {
};
  name?: string;
  persistentAttributeType?: PersistentAttributeType;
}

export enum BindableType {
  ENTITY_TYPE = 'ENTITY_TYPE',
  PLURAL_ATTRIBUTE = 'PLURAL_ATTRIBUTE',
  SINGULAR_ATTRIBUTE = 'SINGULAR_ATTRIBUTE',
}

export interface Cache {
}

export enum CollectionType {
  COLLECTION = 'COLLECTION',
  LIST = 'LIST',
  MAP = 'MAP',
  SET = 'SET',
}

export interface CriteriaBuilder {
}

export interface EmbeddableTypeObject {
  attributes?: SetAttributeSuperObjectObject;
  declaredAttributes?: SetAttributeObjectObject;
  declaredPluralAttributes?: SetPluralAttributeObjectObjectObject;
  declaredSingularAttributes?: SetSingularAttributeObjectObject;
  javaType?: {
};
  persistenceType?: PersistenceType;
  pluralAttributes?: SetPluralAttributeSuperObjectObjectObject;
  singularAttributes?: SetSingularAttributeSuperObjectObject;
}

export interface EntityManager {
  criteriaBuilder?: CriteriaBuilder;
  delegate?: {
};
  entityManagerFactory?: EntityManagerFactory;
  flushMode?: FlushModeType;
  joinedToTransaction?: boolean;
  metamodel?: Metamodel;
  open?: boolean;
  properties?: MapStringObject;
  transaction?: EntityTransaction;
}

export interface EntityManagerFactory {
  cache?: Cache;
  criteriaBuilder?: CriteriaBuilder;
  metamodel?: Metamodel;
  open?: boolean;
  persistenceUnitUtil?: PersistenceUnitUtil;
  properties?: MapStringObject;
}

export interface EntityTransaction {
  active?: boolean;
  rollbackOnly?: boolean;
}

export interface EntityTypeObject {
  attributes?: SetAttributeSuperObjectObject;
  bindableJavaType?: {
};
  bindableType?: BindableType;
  declaredAttributes?: SetAttributeObjectObject;
  declaredPluralAttributes?: SetPluralAttributeObjectObjectObject;
  declaredSingularAttributes?: SetSingularAttributeObjectObject;
  idClassAttributes?: SetSingularAttributeSuperObjectObject;
  idType?: TypeObject;
  javaType?: {
};
  name?: string;
  persistenceType?: PersistenceType;
  pluralAttributes?: SetPluralAttributeSuperObjectObjectObject;
  singularAttributes?: SetSingularAttributeSuperObjectObject;
  supertype?: IdentifiableTypeSuperObject;
}

export interface Fact {
  entityManager?: EntityManager;
  id?: number;
  name?: string;
  persistent?: boolean;
  type?: FactType;
}

export enum FactType {
  BOOLEAN = 'BOOLEAN',
  INT = 'INT',
  LIST = 'LIST',
  STRING = 'STRING',
}

export enum FlushModeType {
  AUTO = 'AUTO',
  COMMIT = 'COMMIT',
}

export interface HistoryItem {
  ctime?: number;
  hostName?: string;
  id?: string;
}

export interface IdentifiableTypeSuperObject {
  attributes?: SetAttributeSuperObjectObject;
  declaredAttributes?: SetAttributeObjectObject;
  declaredPluralAttributes?: SetPluralAttributeObjectObjectObject;
  declaredSingularAttributes?: SetSingularAttributeObjectObject;
  idClassAttributes?: SetSingularAttributeSuperObjectObject;
  idType?: TypeObject;
  javaType?: {
};
  persistenceType?: PersistenceType;
  pluralAttributes?: SetPluralAttributeSuperObjectObjectObject;
  singularAttributes?: SetSingularAttributeSuperObjectObject;
  supertype?: IdentifiableTypeSuperObject;
}

export type List = Array<{
}>;

export type ListHistoryItem = Array<HistoryItem>;

export type ListPolicy = Array<Policy>;

export type ListUUID = Array<string>;

export interface ManagedTypeObject {
  attributes?: SetAttributeSuperObjectObject;
  declaredAttributes?: SetAttributeObjectObject;
  declaredPluralAttributes?: SetPluralAttributeObjectObjectObject;
  declaredSingularAttributes?: SetSingularAttributeObjectObject;
  javaType?: {
};
  persistenceType?: PersistenceType;
  pluralAttributes?: SetPluralAttributeSuperObjectObjectObject;
  singularAttributes?: SetSingularAttributeSuperObjectObject;
}

export interface ManagedTypeObject1 {
}

export interface ManagedTypeSuperObject {
  attributes?: SetAttributeSuperObjectObject;
  declaredAttributes?: SetAttributeObjectObject;
  declaredPluralAttributes?: SetPluralAttributeObjectObjectObject;
  declaredSingularAttributes?: SetSingularAttributeObjectObject;
  javaType?: {
};
  persistenceType?: PersistenceType;
  pluralAttributes?: SetPluralAttributeSuperObjectObjectObject;
  singularAttributes?: SetSingularAttributeSuperObjectObject;
}

export interface MapStringObject {
  [key: string]: {
};
}

export interface MapStringString {
  [key: string]: string;
}

export interface Meta {
  count?: number;
}

export interface Metamodel {
  embeddables?: SetEmbeddableTypeObject;
  entities?: SetEntityTypeObject;
  managedTypes?: SetManagedTypeObject;
}

export interface PagedResponseOfHistoryItem {
  data?: ListHistoryItem;
  links?: MapStringString;
  meta?: Meta;
}

export interface PagedResponseOfPolicy {
  data?: ListPolicy;
  links?: MapStringString;
  meta?: Meta;
}

export enum PersistenceType {
  BASIC = 'BASIC',
  EMBEDDABLE = 'EMBEDDABLE',
  ENTITY = 'ENTITY',
  MAPPED_SUPERCLASS = 'MAPPED_SUPERCLASS',
}

export interface PersistenceUnitUtil {
}

export enum PersistentAttributeType {
  BASIC = 'BASIC',
  ELEMENT_COLLECTION = 'ELEMENT_COLLECTION',
  EMBEDDED = 'EMBEDDED',
  MANY_TO_MANY = 'MANY_TO_MANY',
  MANY_TO_ONE = 'MANY_TO_ONE',
  ONE_TO_MANY = 'ONE_TO_MANY',
  ONE_TO_ONE = 'ONE_TO_ONE',
}

export interface PluralAttributeObjectObjectObject {
  association?: boolean;
  bindableJavaType?: {
};
  bindableType?: BindableType;
  collection?: boolean;
  collectionType?: CollectionType;
  declaringType?: ManagedTypeObject1;
  elementType?: TypeObject;
  javaMember?: {
};
  javaType?: {
};
  name?: string;
  persistentAttributeType?: PersistentAttributeType;
}

export interface PluralAttributeSuperObjectObjectObject {
  association?: boolean;
  bindableJavaType?: {
};
  bindableType?: BindableType;
  collection?: boolean;
  collectionType?: CollectionType;
  declaringType?: ManagedTypeSuperObject;
  elementType?: TypeObject;
  javaMember?: {
};
  javaType?: {
};
  name?: string;
  persistentAttributeType?: PersistentAttributeType;
}

export interface Policy {
  actions?: string;
  conditions: string;
  ctime?: string;
  description?: string;
  entityManager?: EntityManager;
  id?: Uuid;
  isEnabled?: boolean;
  lastTriggered?: number;
  mtime?: string;
  name: string;
  persistent?: boolean;
}

export type SetAttributeObjectObject = Array<AttributeObjectObject>;

export type SetAttributeSuperObjectObject = Array<AttributeSuperObjectObject>;

export type SetEmbeddableTypeObject = Array<EmbeddableTypeObject>;

export type SetEntityTypeObject = Array<EntityTypeObject>;

export type SetManagedTypeObject = Array<ManagedTypeObject>;

export type SetPluralAttributeObjectObjectObject = Array<PluralAttributeObjectObjectObject>;

export type SetPluralAttributeSuperObjectObjectObject = Array<PluralAttributeSuperObjectObjectObject>;

export type SetSingularAttributeObjectObject = Array<SingularAttributeObjectObject>;

export type SetSingularAttributeSuperObjectObject = Array<SingularAttributeSuperObjectObject>;

export interface SingularAttributeObjectObject {
  association?: boolean;
  bindableJavaType?: {
};
  bindableType?: BindableType;
  collection?: boolean;
  declaringType?: ManagedTypeObject1;
  id?: boolean;
  javaMember?: {
};
  javaType?: {
};
  name?: string;
  optional?: boolean;
  persistentAttributeType?: PersistentAttributeType;
  type?: TypeObject;
  version?: boolean;
}

export interface SingularAttributeSuperObjectObject {
  association?: boolean;
  bindableJavaType?: {
};
  bindableType?: BindableType;
  collection?: boolean;
  declaringType?: ManagedTypeSuperObject;
  id?: boolean;
  javaMember?: {
};
  javaType?: {
};
  name?: string;
  optional?: boolean;
  persistentAttributeType?: PersistentAttributeType;
  type?: TypeObject;
  version?: boolean;
}

export interface TypeObject {
  javaType?: {
};
  persistenceType?: PersistenceType;
}

export type Uuid = string;

