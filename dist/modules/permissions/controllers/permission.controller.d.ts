import { PermissionCommandService } from '../services/permission-command.service';
import { PermissionQueryService } from '../services/permission-query.service';
import { PermissionGeneratorService } from '../services/permission-generator.service';
import { PermissionCreateDto } from '../dto/permission-create.dto';
import { PermissionUpdateDto } from '../dto/permission-update.dto';
import { PermissionListQueryDto } from '../dto/permission-list-query.dto';
import { PermissionResponseDto } from '../dto/permission-response.dto';
export declare class PermissionController {
    protected readonly commandService: PermissionCommandService;
    protected readonly queryService: PermissionQueryService;
    private readonly generatorService;
    constructor(commandService: PermissionCommandService, queryService: PermissionQueryService, generatorService: PermissionGeneratorService);
    adminGenerateFromControllers(): Promise<import("../interface/generted-permssion.interfacet").GeneratePermissionsResult>;
    adminCreate(dto: PermissionCreateDto): Promise<{
        id: number;
    }>;
    adminGetById(id: number): Promise<PermissionResponseDto | null>;
    adminGetList(query: PermissionListQueryDto): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<PermissionResponseDto>>;
    adminUpdate(id: number, dto: PermissionUpdateDto): Promise<void>;
    adminDelete(id: number): Promise<void>;
}
