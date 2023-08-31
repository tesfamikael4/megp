"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filter = exports.Order = exports.CollectionQuery = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const filter_operators_1 = require("./filter_operators");
class CollectionQuery {
    constructor() {
        this.orderBy = [];
        this.searchFrom = [];
        this.filter = [];
        this.includes = [];
        this.groupBy = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CollectionQuery.prototype, "top", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CollectionQuery.prototype, "skip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CollectionQuery.prototype, "orderBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CollectionQuery.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CollectionQuery.prototype, "searchFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CollectionQuery.prototype, "filter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CollectionQuery.prototype, "includes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CollectionQuery.prototype, "select", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CollectionQuery.prototype, "locale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CollectionQuery.prototype, "groupBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CollectionQuery.prototype, "count", void 0);
exports.CollectionQuery = CollectionQuery;
var Direction;
(function (Direction) {
    Direction["ASC"] = "ASC";
    Direction["DESC"] = "DESC";
})(Direction || (Direction = {}));
class Order {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Order.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEnum)(Direction, {
        message: 'Direction must be either ASC or DESC',
    }),
    __metadata("design:type", String)
], Order.prototype, "direction", void 0);
exports.Order = Order;
class Filter {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Filter.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Filter.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEnum)(filter_operators_1.FilterOperators, {
        message: `Operator must be one of ${Object.keys(filter_operators_1.FilterOperators).toString()}`,
    }),
    __metadata("design:type", String)
], Filter.prototype, "operator", void 0);
exports.Filter = Filter;
//# sourceMappingURL=collection-query.js.map