import { TransactionService } from '../../../common/transaction/transaction.service';
import { UserRepository } from '../repositories/user.repository';
import { RoleRepository } from '../../roles/repositories/role.repository';
import { MerchantRepository } from '../../merchants/repositories/merchant.repository';
import { UserCreateDto } from '../dto/user-create.dto';
import { UserUpdateDto } from '../dto/user-update.dto';
import { UserMerchantCreateDto } from '../dto/user-merchant-create.dto';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { AcitveDto } from 'src/common/base/dtos/active.dto';
import { ImageQueryRepository } from 'src/modules/images/repositories/image.query-repository';
export declare class UserCommandService {
    private readonly userRepository;
    private readonly roleRepository;
    private readonly merchantRepository;
    private readonly transactionService;
    private readonly imageQueryRepository;
    constructor(userRepository: UserRepository, roleRepository: RoleRepository, merchantRepository: MerchantRepository, transactionService: TransactionService, imageQueryRepository: ImageQueryRepository);
    create(dto: UserCreateDto, auth?: CurrentUserPayload): Promise<{
        id: number;
    }>;
    createUserWithMerchant(dto: UserMerchantCreateDto): Promise<{
        userId: number;
        merchantId: number;
    }>;
    update(id: number, dto: UserUpdateDto, currentUser?: CurrentUserPayload): Promise<void>;
    delete(id: number): Promise<void>;
    setActive(id: number, dto: AcitveDto): Promise<void>;
    changePassword(id: number, dto: ChangePasswordDto): Promise<void>;
}
