import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Music Booking API',
      version: '1.0.0',
      description: 'API for booking music artists for events',
      contact: {
        name: 'API Support',
        url: 'https://github.com/chizobaebuka/music-booking-app'
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3003}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'Bearer token authorization',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            role: { type: 'string', enum: ['artist', 'organizer'] },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          },
          required: ['email', 'password', 'role']
        },
        ArtistProfile: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            stageName: { type: 'string' },
            bio: { type: 'string' },
            genres: {
              type: 'array',
              items: { type: 'string' }
            },
            availability: {
              type: 'array',
              items: { type: 'string' }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['userId', 'stageName']
        },
        Event: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            organizerId: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            location: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['organizerId', 'name', 'description', 'location', 'date']
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            artistId: { type: 'string', format: 'uuid' },
            eventId: { type: 'string', format: 'uuid' },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'canceled'],
              default: 'pending'
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['artistId', 'eventId']
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    paths: {
      '/api/auth/signup': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    role: { type: 'string', enum: ['artist', 'organizer'] }
                  },
                  required: ['email', 'password', 'role']
                }
              }
            }
          },
          responses: {
            201: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            }
          }
        }
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login user',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' }
                  },
                  required: ['email', 'password']
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/auth/users': {
        get: {
          tags: ['Users'],
          summary: 'Get all users',
          security: [ { bearerAuth: [] } ],
          responses: {
            200: {
              description: 'List of users',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/User'
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/auth/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Get user by ID',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid'
              }
            }
          ],
          responses: {
            200: {
              description: 'User details',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            },
            404: {
              description: 'User not found'
            }
          }
        },
        put: {
          tags: ['Users'],
          summary: 'Update user',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid'
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email' },
                    role: { type: 'string', enum: ['artist', 'organizer'] }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'User updated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            },
            404: {
              description: 'User not found'
            }
          }
        },
        delete: {
          tags: ['Users'],
          summary: 'Delete user',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid'
              }
            }
          ],
          responses: {
            200: {
              description: 'User deleted successfully'
            },
            404: {
              description: 'User not found'
            }
          }
        }
      },
      '/api/artists': {
        get: {
          tags: ['Artists'],
          summary: 'Get all artist profiles',
          responses: {
            200: {
              description: 'List of artist profiles',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/ArtistProfile'
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Artists'],
          summary: 'Create artist profile',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ArtistProfile'
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Artist profile created',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ArtistProfile'
                  }
                }
              }
            }
          }
        },
      },
      '/api/artists/{id}': {
        get: {
          tags: ['Artists'],
          summary: 'Get artist profile by ID',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid'
              }
            }
          ],
          responses: {
            200: {
              description: 'Artist profile details',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ArtistProfile'
                  }
                }
              }
            },
            404: {
              description: 'Artist profile not found'
            }
          }
        },
        put: {
          tags: ['Artists'],
          summary: 'Update artist profile',
          security: [
            { bearerAuth: [] }
          ],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid'
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    stageName: { type: 'string', minLength: 2 },
                    bio: { type: 'string' },
                    genres: {
                      type: 'array',
                      items: { type: 'string' }
                    },
                    availability: {
                      type: 'array',
                      items: { type: 'string' }
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Artist profile updated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ArtistProfile'
                  }
                }
              }
            },
            401: {
              description: 'Unauthorized'
            },
            404: {
              description: 'Artist profile not found'
            }
          }
        }
      },
      '/api/artists/user/{userId}': {
        get: {
          tags: ['Artists'],
          summary: 'Get artist profile by user ID',
          parameters: [
            {
              in: 'path',
              name: 'userId',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid'
              }
            }
          ],
          responses: {
            200: {
              description: 'Artist profile details',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ArtistProfile'
                  }
                }
              }
            },
            404: {
              description: 'Artist profile not found'
            }
          }
        }
      },
      '/api/events': {
        get: {
          tags: ['Events'],
          summary: 'Get all events',
          responses: {
            200: {
              description: 'List of events',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Event'
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Events'],
          summary: 'Create new event',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Event'
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Event created',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Event'
                  }
                }
              }
            }
          }
        }
      },
      '/api/bookings': {
        get: {
          tags: ['Bookings'],
          summary: 'Get all bookings',
          responses: {
            200: {
              description: 'List of bookings',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Booking'
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Bookings'],
          summary: 'Create new booking',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Booking'
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Booking created',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Booking'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

export const specs = swaggerJsdoc(options);
