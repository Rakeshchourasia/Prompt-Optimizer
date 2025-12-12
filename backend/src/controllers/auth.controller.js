import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import Workspace from '../models/Workspace.model.js';
import { AppError } from '../middleware/error.middleware.js';

// Generate JWT tokens
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '15m',
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new AppError('User already exists with this email', 400);
        }

        // Create user
        const user = await User.create({
            email,
            password,
            name,
        });

        // Create default workspace
        const workspace = await Workspace.create({
            name: `${name}'s Workspace`,
            owner: user._id,
            members: [{ user: user._id, role: 'owner' }],
        });

        // Set current workspace
        user.currentWorkspace = workspace._id;
        await user.save();

        // Generate tokens
        const accessToken = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token
        user.refreshTokens.push(refreshToken);
        await user.save();

        res.status(201).json({
            success: true,
            data: {
                user,
                workspace,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user with password
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            throw new AppError('Invalid email or password', 401);
        }

        // Generate tokens
        const accessToken = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token
        user.refreshTokens.push(refreshToken);
        await user.save();

        // Get workspace info
        const workspace = await Workspace.findById(user.currentWorkspace);

        res.json({
            success: true,
            data: {
                user: user.toJSON(),
                workspace,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new AppError('Refresh token is required', 400);
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Find user and check if refresh token is valid
        const user = await User.findById(decoded.id);

        if (!user || !user.refreshTokens.includes(refreshToken)) {
            throw new AppError('Invalid refresh token', 401);
        }

        // Generate new access token
        const accessToken = generateToken(user._id);

        res.json({
            success: true,
            data: { accessToken },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            // Remove refresh token from user
            req.user.refreshTokens = req.user.refreshTokens.filter(
                (token) => token !== refreshToken
            );
            await req.user.save();
        }

        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('currentWorkspace');

        res.json({
            success: true,
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};
