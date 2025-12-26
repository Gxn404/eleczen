import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'ElecZen API Documentation',
        version: '2.0.0',
        description: `
# ElecZen Circuit Simulator API

Welcome to the ElecZen API documentation. This API provides comprehensive endpoints for managing circuits, components, libraries, blog posts, and user authentication.

## Features
- 🔌 **Circuit Management** - Create, read, update, and delete circuit designs
- 📦 **Component Library** - Upload and manage electronic component libraries
- 📝 **Blog System** - Manage blog posts and comments
- 🔐 **Authentication** - Secure user authentication and authorization
- 📚 **Encyclopedia** - Access electronics knowledge base

## Base URL
\`\`\`
https://eleczen.com/api
\`\`\`

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
\`\`\`
Authorization: Bearer <your_token>
\`\`\`
        `,
        contact: {
          name: 'ElecZen Support',
          email: 'support@eleczen.com',
          url: 'https://eleczen.com/support'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      servers: [
        {
          url: 'http://localhost:3000/api',
          description: 'Development server'
        },
        {
          url: 'https://eleczen.com/api',
          description: 'Production server'
        }
      ],
      tags: [
        {
          name: 'Circuits',
          description: 'Circuit design and simulation endpoints'
        },
        {
          name: 'Components',
          description: 'Electronic component management'
        },
        {
          name: 'Library',
          description: 'Component library upload and management'
        },
        {
          name: 'Blog',
          description: 'Blog post management'
        },
        {
          name: 'Comments',
          description: 'Comment system for blog posts'
        },
        {
          name: 'Encyclopedia',
          description: 'Electronics knowledge base'
        },
        {
          name: 'Authentication',
          description: 'User authentication and authorization'
        },
        {
          name: 'Admin',
          description: 'Administrative endpoints'
        }
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT token obtained from login endpoint'
          },
          ApiKey: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-Key',
            description: 'API key for service-to-service authentication'
          }
        },
        schemas: {
          Circuit: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique circuit identifier'
              },
              name: {
                type: 'string',
                description: 'Circuit name',
                example: 'RC Low-Pass Filter'
              },
              description: {
                type: 'string',
                description: 'Circuit description',
                example: 'A simple RC low-pass filter with 1kHz cutoff frequency'
              },
              data: {
                type: 'object',
                description: 'Circuit schematic data (components, wires, etc.)',
                properties: {
                  components: {
                    type: 'array',
                    items: { type: 'object' }
                  },
                  wires: {
                    type: 'array',
                    items: { type: 'object' }
                  }
                }
              },
              is_public: {
                type: 'boolean',
                description: 'Whether the circuit is publicly visible',
                default: false
              },
              user_id: {
                type: 'string',
                format: 'uuid',
                description: 'Owner user ID'
              },
              created_at: {
                type: 'string',
                format: 'date-time',
                description: 'Creation timestamp'
              },
              updated_at: {
                type: 'string',
                format: 'date-time',
                description: 'Last update timestamp'
              }
            },
            required: ['name', 'data']
          },
          Component: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid'
              },
              name: {
                type: 'string',
                example: 'NE555'
              },
              type: {
                type: 'string',
                enum: ['resistor', 'capacitor', 'inductor', 'diode', 'transistor', 'ic', 'subckt'],
                example: 'ic'
              },
              category: {
                type: 'string',
                example: 'ICs/Timer'
              },
              metadata: {
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  manufacturer: { type: 'string' },
                  datasheet: { type: 'string', format: 'uri' }
                }
              }
            }
          },
          Library: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid'
              },
              file_path: {
                type: 'string',
                example: 'components/NE555/NE555.ezc'
              },
              library_type: {
                type: 'string',
                enum: ['ezc', 'ezl', 'kicad', 'spice', 'ltspice'],
                example: 'ezc'
              },
              component_count: {
                type: 'integer',
                example: 1
              },
              is_public: {
                type: 'boolean',
                default: false
              }
            }
          },
          BlogPost: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid'
              },
              title: {
                type: 'string',
                example: 'Understanding Op-Amps'
              },
              slug: {
                type: 'string',
                example: 'understanding-op-amps'
              },
              content: {
                type: 'string',
                description: 'Markdown content'
              },
              excerpt: {
                type: 'string'
              },
              published: {
                type: 'boolean',
                default: false
              },
              author_id: {
                type: 'string',
                format: 'uuid'
              },
              created_at: {
                type: 'string',
                format: 'date-time'
              }
            }
          },
          Error: {
            type: 'object',
            properties: {
              error: {
                type: 'string',
                description: 'Error message'
              },
              code: {
                type: 'string',
                description: 'Error code'
              },
              details: {
                type: 'object',
                description: 'Additional error details'
              }
            }
          }
        },
        responses: {
          UnauthorizedError: {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  error: 'Unauthorized',
                  code: 'AUTH_REQUIRED'
                }
              }
            }
          },
          NotFoundError: {
            description: 'Resource not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  error: 'Not found',
                  code: 'NOT_FOUND'
                }
              }
            }
          },
          ValidationError: {
            description: 'Invalid request data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  error: 'Validation failed',
                  code: 'VALIDATION_ERROR',
                  details: {
                    field: 'name',
                    message: 'Name is required'
                  }
                }
              }
            }
          }
        }
      },
      security: []
    },
  });
  return spec;
};
