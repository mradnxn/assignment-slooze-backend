import { IsEmail, IsNotEmpty, MinLength, Matches, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: "Please provide a valid email!." })
    @IsNotEmpty()
    email!: string;

    @IsNotEmpty()
    @MinLength(3, { message: "Name must be at least 3 characters long!." })
    name!: string;

    @IsNotEmpty({ message: "Please provide a valid password!." })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password is too weak. It must contain an uppercase letter, a lowercase letter, and a number.',
    })
    password!: string;

    @IsNotEmpty({ message: "Please provide a valid role!." })
    role!: string;

    @IsOptional()
    @IsString()
    country?: string;
}
