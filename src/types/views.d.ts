/**
 * views system
 */
// role
declare interface RowRoleType {
	id: string;
	name: string;
	roleKey: string;
	remark: string | null;
	sort: number;
	status: number;
	keys: string[];
}
declare interface DataModel {
	id: string;
	dictValue: string;
}
declare type DataModelList = DataModel[];

declare interface NodeModel {
	id: number;
	dictValue: string;
	state: number;
	dictDesc: string;
}
declare type NodeModelList = NodeModel[];

declare interface ProjectModel {
	organizeId: number;
	organizeName: string;
}
declare type ProjectModelList = ProjectModel[];

declare interface DataDetailType {
	id: string;
	enterpriseId: string;
	nodeName: string;
	fileId: string;
	name: string;
	typeName: string;
	nodePort: string;
	nodeIp: string;
	createTime: string;
	updateTime: string;
	activationStatus: string;
	onlineStatus: string;
	description: string;
	fieldList: DataDetailFieldListObject[];
	upDatabaseVersion: string,
	upDatabasePort:string,
	upDatabaseTable:string,
	typeId: string,
	upDatabaseType:string,
	upDatabaseHost:string,
	upDatabaseUsername:string,
	upDatabaseName:string,
	keyName:string,
	label:string,

}
declare type DataDetailFieldListType = DataDetailFieldListObject[];
declare interface DataDetailFieldListObject {
	id: string;
	dataId: string;
	type: string;
	name: string;
	description: string;
}

declare interface ManData {
	name: string;
	organizeName: string;
	createTime: string;
}
declare interface UseData {
	projectName: string;
	pipelineName: string;
	createTime: string;
}
declare interface DataListObjectType {
	nodeId: string;
	description: string;
	id: string;
	enterpriseId: string;
	name: string;
	createTime: string;
	createBy: string;
	updateTime: string;
	updateBy: string;
}
declare type DataListList = DataListObjectType[];
declare type DataList = DataListObject[];
declare interface DataListObject {
	id: string;
	partnerId: string;
	dataId: string;
	name: string;
	rows: string;
	dataType: string;
	enterpriseName: string;
}
declare interface NodeDetailType {
	nodeId: string;
	userId: string;
	enterpriseId: string;
	nodeName: string;
	nodePort: string;
	nodeIp: string;
	createTime: string;
	updateTime: string;
	activationStatus: string;
	onlineStatus: string;
}

declare interface SysRoleState {
	roleName: string;
	roleKey: string;
	status: string;
	pageSize: number;
	pageNum: number;
	total: number;
	loading: boolean;
	tableData: RowRoleType[];
}

declare type TreeType = {
	id: number;
	name: string;
	children?: TreeType[];
};

// user
declare type RowUserType<T = any> = {
	create_time: string;
	phone: string;
	loginName: string;
	roles: [];
	realName: string;
	real_name: string;
	positions: [];
	id: string;
	status: string;
	email: string;
	password: string;
	depts: [];
	remark: string;
	roleList: [];
	positionList: [];
};
declare interface SysNodeState {
	nodeName: string;
	onlineStatus: string;
	pageSize: number;
	pageNum: number;
	total: number;
	loading: boolean;
	tableData: NodeState[];
}
declare interface ProjectState {
	pageSize: number;
	pageNum: number;
	total: number;
	type: string;
	name: string;
	createTime: string;
	enterpriseId: string;
	createStartTime: string;
	loading: boolean;
	tableData: ProjectStateType[];
}
declare interface ProjectStateType {
	id: string;
	enterpriseName: string;
	name: string;
	partnerNum: number;
	status: number;
	createTime: string;
}

declare interface ProjectDetailType {
	id: string;
	enterpriseId: string;
	name: string;
	description: string;
	createTime: string;
	partnerAudit: object;
	projectPartnerList: ProjectPartnerList;
}

declare interface PartnerAudit {
	partnerId: string
	enterpriseId: string
	auditState: string
	auditOpinion: string
}


declare type NodeOptionsListType = NodeState[];
declare interface ComponentNodeState {
	category: string;
	componentDesc: string;
	componentFieldList: [];
	componentName: string;
	nodePort: string;
	id: string;
	inputDataAnchor: string;
	inputDataParam: string;
	inputModelAnchor: string;
	moduleName: string;
	outputDataAnchor: string;
	outputModelAnchor: string;
	outputDataParam: string;
}
declare type ProjectPartnerList = ProjectPartnerListObject[];
declare interface ProjectPartnerListObject {
	partnerId: string;
	enterpriseId: string;
	auditState: string;
	auditOpinion: string;
	dataList: DataList;
	enterpriseName: string;
}
declare interface NodeState {
[x: string]: string;
	id:string;
	nodeId: string;
	userId: string;
	enterpriseId: string;
	nodeName: string;
	nodePort: string;
	nodeIp: string;
	createTime: string;
	updateTime: string;
	activationStatus: string;
	onlineStatus: string;
}
interface SysUserTableType extends TableType {
	data: RowUserType[];
}

declare interface SysUserState {
	loading: boolean;
	pageNum: number;
	pageSize: number;
	total: number;
	loginName: string;
	tableData: RowUserType[];
	roleList: RowRoleType[];
}

declare interface OrgTreeType {
	id: string;
	name: string;
	children?: OrgTreeType[];
}

declare interface RowDeptType extends OrgTreeType {
	parentId: string;
	name: string;
	sort: number;
}

declare type PostType = {
	id: string;
	code: string;
	create_time: string;
	name: string;
	ancestorsName: string;
	status: string;
};

declare interface SysDeptState {
	loading: boolean;
	orgLoading: boolean;
	name: string;
	status: string;
	orgId: string;
	pageNum: number;
	pageSize: number;
	total: number;
	tableData: PostType[];
	tableOrgData: OrgTreeType[];
}

declare interface RowPostType extends PostType {
	id: string;
	orgId: string;
	menuIds: string[];
}

//tenant
declare interface TenantTreeType {
	id: string;
	tenantName: string;
	children?: TenantTreeType[];
}

declare interface RowTenantType extends TenantTreeType {
	parentId: string;
	tenantName: string;
	// sort: number;
}
declare interface SysTenantState {
	isOnceMore: boolean;
	loading: boolean;
	tenantLoading: boolean;
	id: string;
	tableTenantData: TenantTreeType[];
	form: T;
}

// dic
type ListType = {
	id: number;
	label: string;
	value: string;
};

declare interface RowDicType {
	dicName: string;
	fieldName: string;
	describe: string;
	status: boolean;
	createTime: string;
	list: ListType[];
}

interface SysDicTableType extends TableType {
	data: RowDicType[];
}

declare interface SysDicState {
	tableData: SysDicTableType;
}

declare interface Area {
	zoneId: string;
	zoneName: string;
}
declare interface AreaPickerType {
	province: string;
	city: string;
	areaCode: string;
	provinceList: Area[];
	cityList: Area[];
	areaList: Area[];
}

declare interface AreaCodeType {
	province: string;
	city: string;
	area: string;
}

declare interface IndustryCodeType {
	industryCategory: string;
	industrySpecific: string;
}

/**
 * views dict
 */
// dict
declare interface RowDicTType {
	dicName: string;
	dicType: string;
	createTime: string;
}
interface DicTableType extends TableType {
	data: RowDicTType[];
}
declare interface DicState {
	tableData: DicTableType;
}
// dictMaintain
declare interface RowMaintainDicT {
	id: number;
	mainId: string;
	dictValue: string;
	state: number;
	sort: number;
}
interface MaintainDicTableType extends TableType {
	data: RowMaintainDicT[];
}
declare interface MaintainDicState {
	tableData: MaintainDicTableType;
}

declare interface dictType {
	id: number;
	dictValue: string;
	sort: number;
	state: number;
}
// tenantdict
declare interface RowTenantdict {
	id: number;
	dictName: string;
	dictCode: string;
	dictDesc: string;
	updateTime: string;
}
interface TenantDicTableType extends TableType {
	data: RowTenantdict[];
}
declare interface TenantDicState {
	tableData: TenantDicTableType;
}

// constructordict
declare interface RowConstructordict {
	dicName: string;
	fieldCode: string;
	status: boolean;
	createTime: string;
}
interface ConstructorDicTableType extends TableType {
	data: RowConstructordict[];
}
declare interface ConstructorDicState {
	tableData: ConstructorDicTableType;
}

// ownershipdict
declare interface RowOwnershipict {
	dicName: string;
	fieldCode: string;
	status: boolean;
	createTime: string;
}
interface OwnershipDicTableType extends TableType {
	data: RowOwnershipict[];
}
declare interface OwnershipDicState {
	tableData: OwnershipDicTableType;
}

declare interface EtypeRow {
	id: number;
	name: string;
	code: string;
	num: number;
	remark: string;
	createTime: string;
}
declare interface EtypeState {
	pageNum: number;
	pageSize: number;
	total: number;
	deviceTypeName: string;
	deviceTypeCode: string;
	state: string;
	loading: boolean;
	createTime: Date[];
	tableData: EtypeRow[];
}

declare interface EquipParamsRowType {
	name: string;
	code: string;
}

declare interface LineTreeType {
	id: number;
	name: string;
	level: number;
	parentId: number;
	children?: LineTreeType[];
}

// file-upload
declare interface FileListType {
	name?: string;
	url?: string;
	preview?: string;
}
declare interface FileUploadType {
	fileList: Array<FileListType>;
	fileUploadUrl: string;
	loading: any;
}

declare interface ImageloadType {
	fileList: Array<FileListType>;
	fileUploadUrl: string;
	loading: any;
}

// sparepartsManage
declare interface SparepartsTableType {
	id: number;
	name: string;
	code: string;
	identifierCode: string;
	typeName: string;
	inventoryNum: string;
	whereHouse: string;
	status: number;
	updateTime: string;
}
declare interface SparepartsState {
	pageNum: number;
	pageSize: number;
	total: number;
	loading: boolean;
	tableData: SparepartsTableType[];
	name: string;
	code: string;
	typeName: string;
	status: string;
	createTime: Date[];
}
declare interface TypeListType {
	value: string;
	label: string;
}
declare interface sparepartsAddType {
	typeList: Array<TypeListType>;
	creatorData: Array<TypeListType>;
	url: string;
	form: T;
	loading: any;
	fileList: Array<FileListType>;
	imgFileList: Array<FileListType>;
}
// sparepartsType
declare interface sparepartsTypeTableType {
	id: number;
	name: string;
	code: string;
	remark: string;
	createTime: string;
	status: number;
}
declare interface sparepartsTypeState {
	pageNum: number;
	pageSize: number;
	total: number;
	loading: boolean;
	tableData: sparepartsTypeTableType[];
	name: string;
	code: string;
}

// 设备
declare interface DeviceType {
	createTime: string;
	creatorKey: string;
	deviceCode: string;
	deviceName: string;
	groupName: string;
	id: string;
	identifierCode: string;
	state: number;
	typeName: string;
}

// 维保计划
declare interface MaintenancePlanOptionType {
	deviceId: string;
	standardId: string;
}

// 保养标准
declare interface CheckItemType {
	name: string;
	method: string;
	content: string;
	standardImg: string;
	type: number;
	maintenanceType: number;
	unit: string;
	upperLimit: string;
	lowerLimit: string;
	spareId: string;
	spareNumber: number;
	workHours: number;
}

declare interface MaintenanceType {
	name: string;
	method: string;
	content: string;
	type: number;
	value: number;
	spareName: string;
	spareNumber: number;
	spareUseNumber: number;
	lowerLimit: number;
	upperLimit: number;
	unit: string;
	checkStartTime: string;
	checkEndTime: string;
	checkUserName: string;
}

declare interface StandardType {
	id: number;
	name: string;
}

declare interface SpotcheckType {
	name: string;
	method: string;
	content: string;
	type: number;
	value: number;
	lowerLimit: number;
	upperLimit: number;
	sparePartNum: number;
	spareUseNumber: number;
	materialUseNumber: number;
	unit: string;
}

// 操作日志
declare interface OperationLogTableType {
	userName: string;
	realName: string;
	createdBy: string;
	bizType: string;
	operationContent: string;
	complete: boolean;
	success: string;
	fail: string;
}

// 维修工单
declare interface WorkOrderType {
	isAdd: boolean;
	name: string;
	code: string;
	[key: string]: T;
}

// 文档知识库
declare interface DocumentRepositoryType {
	id?: string;
	typeId: string;
	typeName: string;
	name: string;
	remark: string;
	createdBy?: string;
	createTime?: string;
	attachments?: Array<FileListType>;
}

// 编码规则
declare interface RuleColumnsType {
	key: string;
	title: string;
	type?: number;
}

declare interface EnterpriseType {
	id: string;
	name: string;
}

declare interface optionItem {
	value: string;
	label: string;
}
declare interface SysDataState {
	pageSize: number;
	pageNum:number;
	total: number;
	name: string;
	loading:boolean;
	tableData: FlTaskType[];
}

declare interface FlTaskState {
	loading: boolean;
	pageNum: number;
	pageSize: number;
	total: number;
	name: string;
	tableData: FlTaskType[];
	recordData: FlRecordType[]
}

declare interface DataType {
	id: string;
	typeId: string;
	name: string;
	authStatus: string;
	namespace: string;
	tableName: string
}
declare interface FlTaskType {
	id:'',
	name:'',
	projectId:'',
	projectName:'',
	description:'',
	fedType:'',
	dagContent:'',
	createdBy:'',
	createTime:'',
	updatedBy:'',
	updateTime:''
}

declare interface FlRecordType{
	id:'',
	name:'',
	taskName:'',
	taskId:'',
	fedType:'',
	status:'',
	startTime:'',
	endTime:'',
	modelId:'',
	modelVersion:''
}

declare interface LoginType {
	userName: string;
	password: string;
	rememberMe: boolean;
	code?: string;
	uuid?: string;
}

// privacy
declare interface privacyListData {
	algorithmType: string;
	createTime: string;
	createdBy: string;
	id: string;
	name: string;
	projectId: string;
	projectName: string;
	updateTime: string;
}
declare interface privacyHistoryData {
	id: string;	
	name: string;
	taskName: string;
	taskId: string;
	projectId: string;
	projectName: string;
	status: string;
	startTime: string;
	endTime: string;
	modelId: string;
	createdBy: string;
}

declare interface privacyList {
	loading: boolean;
	pageNum: number;
	pageSize: number;
	total: number;
	tableData: privacyListData[];
}

declare interface privacyHistoryList {
	loading: boolean;
	pageNum: number;
	pageSize: number;
	total: number;
	taskName: string;
	tableData: privacyHistoryData[];
}