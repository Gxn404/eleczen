'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDoc() {
    return (
        <div className="swagger-container bg-black">
            <SwaggerUI url="/api/swagger" />
        </div>
    );
}
