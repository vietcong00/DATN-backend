import { FoodBillingService } from './../food-billing/service/food-billing.service';
import { BookingService } from './../booking/services/booking.service';
import {
    ErrorResponse,
    SuccessResponse,
} from 'src/common/helpers/api.response';
import {
    Controller,
    Get,
    InternalServerErrorException,
    UseGuards,
    Query,
    Body,
    Post,
    Param,
    ParseIntPipe,
    Patch,
} from '@nestjs/common';
import { JoiValidationPipe } from '../../common/pipes/joi.validation.pipe';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { queryDropdownSchema } from './dto/request/dropdown.dto';

import { CommonDropdownService } from './services/common-dropdown.service';
import {
    ListBankDropdown,
    ListCategoryDropdown,
    ListFoodDropdown,
    ListProvinceDropdown,
    ListRoleDropdown,
    ListUserDropdown,
} from './dto/responses/user-dropdown-response.dto';
import { QueryDropdown } from './dto/request/dropdown.dto';
import {
    AuthorizationGuard,
    Permissions,
} from 'src/common/guards/authorization.guard';
import { RemoveEmptyQueryPipe } from 'src/common/pipes/remove.empty.query.pipe';

import {
    PermissionResources,
    PermissionActions,
} from 'src/modules/role/role.constants';
import { TrimObjectPipe } from 'src/common/pipes/trim.object.pipe';
import { BookingStatus } from '../booking/booking.constant';
import {
    CreateBookingSchema,
    CreateBookingDto,
} from '../booking/dto/requests/create-booking.dto';
import { DatabaseService } from 'src/common/services/database.service';
import { MobileService } from './services/mobile.service';
import {
    CreateFoodBillingSchema,
    CreateFoodBillingDto,
    UpdateFoodBillingDto,
    UpdateFoodBillingSchema,
} from '../food-billing/dto/food-billing.dto';
import { FoodBilling } from '../food-billing/entity/food-billing.entity';
import { HttpStatus } from 'src/common/constants';

@Controller('common')
export class CommonController {
    i18n: any;
    constructor(
        private readonly commonDropdownService: CommonDropdownService,
        private readonly bookingService: BookingService,
        private readonly mobileService: MobileService,
        private readonly foodBillingService: FoodBillingService,
        private readonly databaseService: DatabaseService,
    ) {}

    @Get('/province')
    @UseGuards(JwtGuard)
    async getProvinces(
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(queryDropdownSchema),
        )
        query: QueryDropdown,
    ) {
        try {
            const listProvince: ListProvinceDropdown =
                await this.commonDropdownService.getListProvince(query);

            return new SuccessResponse(listProvince);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Get('/user')
    @UseGuards(JwtGuard, AuthorizationGuard)
    @Permissions([`${PermissionResources.USER}_${PermissionActions.READ}`])
    async getUsers(
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(queryDropdownSchema),
        )
        query: QueryDropdown,
    ) {
        try {
            const listUserDropdown: ListUserDropdown =
                await this.commonDropdownService.getListUser(query);
            return new SuccessResponse(listUserDropdown);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Get('/role')
    @UseGuards(JwtGuard, AuthorizationGuard)
    @Permissions([`${PermissionResources.USER}_${PermissionActions.READ}`])
    async getRoles(
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(queryDropdownSchema),
        )
        query: QueryDropdown,
    ) {
        try {
            const listRoleDropdown: ListRoleDropdown =
                await this.commonDropdownService.getListRole(query);
            return new SuccessResponse(listRoleDropdown);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Get('/bank')
    @UseGuards(JwtGuard)
    async getBanks(
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(queryDropdownSchema),
        )
        query: QueryDropdown,
    ) {
        try {
            const data: ListBankDropdown =
                await this.commonDropdownService.getListBank(query);
            return new SuccessResponse(data);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Get('/category')
    @UseGuards(JwtGuard)
    async getCategories(
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(queryDropdownSchema),
        )
        query: QueryDropdown,
    ) {
        try {
            const data: ListCategoryDropdown =
                await this.commonDropdownService.getListCategory(query);
            return new SuccessResponse(data);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Post('booking')
    async createBooking(
        @Body(new TrimObjectPipe(), new JoiValidationPipe(CreateBookingSchema))
        body: CreateBookingDto,
    ) {
        try {
            body.status = BookingStatus.WAITING;
            const newBooking = await this.bookingService.createBooking(body);
            return new SuccessResponse(newBooking);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Get('/food')
    async getFood(
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(queryDropdownSchema),
        )
        query: QueryDropdown,
    ) {
        try {
            const data: ListFoodDropdown =
                await this.commonDropdownService.getListFood(query);
            return new SuccessResponse(data);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Get('/billing/table/:id')
    async getBilling(@Param('id', ParseIntPipe) id: number) {
        try {
            const material = await this.mobileService.getBillingRelativeTable(
                id,
            );
            if (!material) {
                const message = await this.i18n.translate(
                    'material.message.materialNotFound',
                );
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    message,
                    [],
                );
            }
            return new SuccessResponse(material);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Get('/food-billing')
    async getFoodBilling(
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(queryDropdownSchema),
        )
        query: QueryDropdown,
    ) {
        try {
            const data = await this.mobileService.getFoodBillingRelativeTable(
                query.tableId,
            );
            return new SuccessResponse(data);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Post('/food-billing')
    async createFoodBilling(
        @Body(
            new TrimObjectPipe(),
            new JoiValidationPipe(CreateFoodBillingSchema),
        )
        body: CreateFoodBillingDto,
    ) {
        try {
            body.processingCount = 0;
            body.doneCount = 0;
            body.canceledCount = 0;
            const newFoodBilling =
                await this.foodBillingService.createFoodBilling(body);
            return new SuccessResponse(newFoodBilling);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Patch('food-billing/:id')
    @Permissions([
        `${PermissionResources.CLOSING_REVENUE}_${PermissionActions.UPDATE}`,
    ])
    async updateFoodBillingStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body(
            new TrimObjectPipe(),
            new JoiValidationPipe(UpdateFoodBillingSchema),
        )
        body: UpdateFoodBillingDto,
    ) {
        try {
            const oldFoodBilling = await this.databaseService.getDataById(
                FoodBilling,
                id,
            );
            if (!oldFoodBilling) {
                const message = await this.i18n.translate(
                    'material.message.materialNotFound',
                );
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    message,
                    [],
                );
            }
            const material =
                await this.foodBillingService.updateFoodBillingStatus(id, body);
            return new SuccessResponse(material);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
